using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.Entities;
using onlineShopping.Entities.OrderAggregate;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.Interface;
using onlineShopping.Extensions;
using onlineShopping.DTOs.Orders;
using onlineShopping.DTOs.Product;
using AutoMapper;

namespace onlineShopping.Services
{
    public class OrderService : IOrders
    {

        private readonly IMessageHandler _messageHandler;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly StoreContext _storeContext;
        private readonly IMapper _mapper;


        //  IHttpContextAccessor و StoreContext
        public OrderService(StoreContext context, IHttpContextAccessor httpContextAccessor, IMessageHandler messageHandler)
        {
            _storeContext = context;
            _httpContextAccessor = httpContextAccessor;
            _messageHandler = messageHandler;
        }

        public async Task<ServiceResponse<OrderResponseDto>> CreateOrderAsync(AddNewOrderDto addNewOrderDto)
        {
            try
            {
                var username = _httpContextAccessor.HttpContext.User.Identity.Name;

                // get Basket
                var basket = await _storeContext.Baskets
                             .RetriveBasketWithItems(username)
                             .FirstOrDefaultAsync();
                             
                 if(basket is null)
                {
                    return _messageHandler.GetServiceResponse<OrderResponseDto>(ErrorMessage.NotFound,null, "Basket Not Found");
                }

                var items = new List<OrderItem>();


                // check if product is same price or change 
                foreach(var item in basket.Items)
                {
                    // get product info from table product
                    var productItem = await _storeContext.Products.FindAsync(item.ProductId);
                    var itemOrderd = new ProductItemOrderd
                    {
                        ProductId = productItem.Id,
                        NameEn = productItem.NameEn,
                        NameAr = productItem.NameAr,
                        PictureUrl = productItem.PicterUrl
                    };

                    var orderItem = new OrderItem
                    {
                        ItemOrderd = itemOrderd,
                        Price = productItem.Price,
                        Quantity = item.Quantity,
                    };
                    items.Add(orderItem);

                    productItem.QuantityStock -= item.Quantity;
                }

                var subtotal = items.Sum(item => item.Price * item.Quantity);
                var deliveryFee = subtotal > 100 ? 0 : 2;


                var order = new Order
                {
                    OrderItems = items,
                    BuyerId = username,
                    ShippingAddress = addNewOrderDto.ShippingAddress,
                    Subtotal = subtotal,
                    DeliveryFee = deliveryFee,
                    PaymentIntendId = basket.PaymentIntendId,
                    PaymentStatus  = PaymentStatus.Pending,
                    OrderStatus  = "new"

                };


             
                _storeContext.Orders.Add(order);
                _storeContext.Baskets.Remove(basket);




                if (addNewOrderDto.SaveAddress)
                {
                    var updateUserAddress = await SaveShippingAddress(addNewOrderDto);
                }

                var result = await _storeContext.SaveChangesAsync() > 0;


                var orderRoute = $"/api/orders/{order.Id}";

                var getOrderId = new OrderResponseDto
                {
                    Id = order.Id,
                    paymentStatus = order.PaymentStatus,
                };

                return _messageHandler.GetServiceResponse<OrderResponseDto>(SuccessMessage.Retrieved, getOrderId, "order saved");


            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<OrderResponseDto>(ErrorMessage.NotFound, null, "Order not Save");

            }
        }


        // Get List Of Orders
        public async Task<ServiceResponse<List<OrderDto>>> GetOrdersAsync()
        {
            try
            {

                var username = _httpContextAccessor.HttpContext.User.Identity.Name;
                var order = await _storeContext.Orders
                            .ProjectOrderToOrderDto()
                            .Where(x => x.BuyerId == username)
                            .ToListAsync();

                return _messageHandler.GetServiceResponse<List<OrderDto>>(SuccessMessage.Retrieved, order, "Success Retrieved order");
            }
            catch (Exception ex)
            {
                  return _messageHandler.GetServiceResponse<List<OrderDto>>(ErrorMessage.ServerInternalError, null, "GetListOrderAsync");

            }
        }

        public async Task<ServiceResponse<OrderDto>> GetOrderAsync(int id)
        {
            try
            {
                var username = _httpContextAccessor.HttpContext.User.Identity.Name;

                var order =await _storeContext.Orders
                               .ProjectOrderToOrderDto()
                               .Where(x => x.BuyerId == username && x.Id == id)
                               .FirstOrDefaultAsync();


                if(order is null)
                {
                    return _messageHandler.GetServiceResponse<OrderDto>(ErrorMessage.NotFound, null, "Order");
                }

                return _messageHandler.GetServiceResponse(SuccessMessage.Retrieved, order);

            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<OrderDto>(ErrorMessage.ServerInternalError, null, "GetOrder");

            }
        }



        private async Task<User>  SaveShippingAddress(AddNewOrderDto addNewOrderDto)
        {
            var username = _httpContextAccessor.HttpContext.User.Identity.Name;

            var user = await _storeContext.Users
                       .Include(u => u.Address)
                       .FirstOrDefaultAsync(u => u.UserName == username);

            if (user is not null)
            {
                if (user.Address is null)
                {
                    user.Address = new Address
                    {
                        FullName = addNewOrderDto.ShippingAddress.FullName,
                        Address1 = addNewOrderDto.ShippingAddress.Address1,
                        Address2 = addNewOrderDto.ShippingAddress.Address2,
                        City = addNewOrderDto.ShippingAddress.City,
                        Country = addNewOrderDto.ShippingAddress.Country,
                        PostalCode = addNewOrderDto.ShippingAddress.PostalCode,
                        State = addNewOrderDto.ShippingAddress.State,
                    };
                }

                else
                {
                    user.Address.FullName = addNewOrderDto.ShippingAddress.FullName;
                    user.Address.Address1 = addNewOrderDto.ShippingAddress.Address1;
                    user.Address.Address2 = addNewOrderDto.ShippingAddress.Address2;
                    user.Address.City = addNewOrderDto.ShippingAddress.City;
                    user.Address.Country = addNewOrderDto.ShippingAddress.Country;
                    user.Address.PostalCode = addNewOrderDto.ShippingAddress.PostalCode;
                    user.Address.State = addNewOrderDto.ShippingAddress.State;
                }

            }


            _storeContext.Update(user);
            return user;
        }


        public async Task<ServiceResponse<List<OrderDto>>> GetAllOrdersAsync()
        {
            try
            {

                var order = await _storeContext.Orders
                            .ProjectOrderToOrderDto()
                            .ToListAsync();

                return _messageHandler.GetServiceResponse<List<OrderDto>>(SuccessMessage.Retrieved, order, "Success Retrieved order");
            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<List<OrderDto>>(ErrorMessage.ServerInternalError, null, "GetListOrderAsync");

            }
        }

        public async Task<ServiceResponse<OrderDto>> UpdateOrder(updateOrderDto updateOrder)
        {
            try
            {
                var order = await _storeContext.Orders.FirstOrDefaultAsync(x => x.Id == updateOrder.Id);

                if (order is null)
                {
                    return _messageHandler.GetServiceResponse<OrderDto>(ErrorMessage.ServerInternalError, null, "UpdateOrder");
                }

               
                if(order.OrderStatus != "Delivered")
                {
                    order.OrderStatus = updateOrder.OrderStatus;
                    _storeContext.Update(order);
                    await _storeContext.SaveChangesAsync();
                }
              

                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderStatus = order.OrderStatus.ToString(),
                };

                return _messageHandler.GetServiceResponse<OrderDto>(SuccessMessage.Retrieved, orderDto, "Success Update order");
            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<OrderDto>(ErrorMessage.ServerInternalError, null, "UpdateOrder");
            }
        }
    }
}
