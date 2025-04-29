using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onlineShopping.DTOs;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.Interface;

namespace onlineShopping.Controllers
{

    public class PaymentsController : BaseApiController
    {
        private readonly IPayments _payments;

        public PaymentsController(IPayments payments,IMessageHandler messageHandler, IHttpContextAccessor contextAccessor) : base(messageHandler, contextAccessor)
        {
            _payments = payments;
        }


        [Authorize]
        [HttpPost("payments")]

        public async Task<ActionResult<BasketDto>> Payment()
        {
            return GetServiceResponse(await _payments.CreateOrUpdatePaymentIntent());
        }




        [AllowAnonymous]
        [HttpPost("stripe-webhook")]

        public async Task<ActionResult> StripeWebhook()
        {
            return GetServiceResponse(await _payments.StripeWebhook());
        }

    }
}
