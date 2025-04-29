using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs;
using onlineShopping.DTOs.Orders;
using onlineShopping.Entities;
using onlineShopping.Entities.OrderAggregate;
using onlineShopping.Extensions;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.Interface;
using Stripe;
using Microsoft.Extensions.Logging;


namespace onlineShopping.Services
{
    public class PaymentService : IPayments
    {

        private readonly IMessageHandler _messageHandler;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly StoreContext _storeContext;
        private readonly PaymentExtension _paymentExtension;
        private readonly IConfiguration _config;
        private readonly ILogger<PaymentService> _logger;

        // حقن IHttpContextAccessor و StoreContext
        public PaymentService(PaymentExtension paymentExtension,StoreContext context, IHttpContextAccessor httpContextAccessor, IMessageHandler messageHandler,IConfiguration config,ILogger<PaymentService> logger)
        {
            _storeContext = context;
            _httpContextAccessor = httpContextAccessor;
            _messageHandler = messageHandler;
            _paymentExtension = paymentExtension;
            _config = config;
            _logger = logger;

        }

        public async Task<ServiceResponse<BasketDto>> CreateOrUpdatePaymentIntent()
        {

            try
            {
                var userName = _httpContextAccessor.HttpContext.User.Identity.Name;

                var basket = await _storeContext.Baskets
                              .RetriveBasketWithItems(userName)
                              .FirstOrDefaultAsync();
                if(basket is null)
                {
                    return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.NotFound, null, "basket not found");

                }

                var intent = await _paymentExtension.CreateOrUpdatePaymentIntent(basket);

                if(intent is null)
                {
                    return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.NotFound, null, "Problem creating payment intent");
                }

                basket.PaymentIntendId = basket.PaymentIntendId ?? intent.Id;
                basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

                _storeContext.Update(basket);

                var result = await _storeContext.SaveChangesAsync() > 0;

                if(!result)
                {
                    return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.BadRequest, null, "Problem updating basket with intent");

                }
                return _messageHandler.GetServiceResponse<BasketDto> (SuccessMessage.Retrieved, basket.MapBasketToDto(), "Success Payment ");




            }
            catch (Exception ex) 
            {
                return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.ServerInternalError, null, "Error In Payment");

            }
        }

        public async Task<ServiceResponse> StripeWebhook()
        {
            var json = await new StreamReader(_httpContextAccessor.HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = ConstractStripeEvent(json);

                if(stripeEvent.Data.Object is not PaymentIntent intent)
                {
                    return _messageHandler.GetServiceResponse(ErrorMessage.InvalidInput, "Invalid event data");

                }

                if (intent.Status == "succeeded") await HandlePaymentIntentSucced(intent);
                else await HandlePaymentIntentFailed(intent);

                return _messageHandler.GetServiceResponse(SuccessMessage.Approved, "Success webHook ");


            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe webhook error");
                return _messageHandler.GetServiceResponse(ErrorMessage.ServerInternalError, "Webhook error");            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An expected error has occurred");
                return _messageHandler.GetServiceResponse(ErrorMessage.ServerInternalError, "Unexpected error");
            
            }
        }

        private async Task HandlePaymentIntentSucced(PaymentIntent intent)
        {
            var order = await _storeContext.Orders
                .Include(x => x.OrderItems)
                .FirstOrDefaultAsync(x => x.PaymentIntendId == intent.Id)
                ??  throw new Exception("Order not found");

            if(order.GetTotal() != intent.Amount)
            {
                order.PaymentStatus = PaymentStatus.PaymentMismatch;
            }else
            {
                order.PaymentStatus = PaymentStatus.PaymentReceived;
            }


            var basket = await _storeContext.Baskets.FirstOrDefaultAsync(x => x.PaymentIntendId == intent.Id);

            if(basket is not  null) _storeContext.Baskets.Remove(basket);
            await _storeContext.SaveChangesAsync();
        }



        private async Task HandlePaymentIntentFailed(PaymentIntent intent)
        {
            var order = await _storeContext.Orders
                   .Include(x => x.OrderItems)
                   .FirstOrDefaultAsync(x => x.PaymentIntendId == intent.Id)
                       ?? throw new Exception("Order not found");

            foreach (var item in order.OrderItems)
            {
                var productItem = await _storeContext.Products
                    .FindAsync(item.ItemOrderd.ProductId)
                        ?? throw new Exception("Problem updating order stock");

                productItem.QuantityStock += item.Quantity;
            }

            order.PaymentStatus = PaymentStatus.PaymentFailed;

            await _storeContext.SaveChangesAsync();
        }




        private Event ConstractStripeEvent(string json)
        {
            try
            {
                var sigHeader = _httpContextAccessor.HttpContext.Request.Headers["Stripe-Signature"];
                var webhookSecret = _config["StripeSetting:WhSecret"];
                return EventUtility.ConstructEvent(json, sigHeader, webhookSecret);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to construct stripe event");
                throw new StripeException("Invalid signature");
            }
        }
    }
}
