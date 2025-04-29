using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onlineShopping.Data;
using onlineShopping.DTOs.Orders;
using onlineShopping.Entities.OrderAggregate;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services;
using onlineShopping.Services.Interface;
using System.Reflection.Metadata.Ecma335;

namespace onlineShopping.Controllers
{
    [Authorize]
    public class OrdersController(IOrders ordersService, IMessageHandler messageHandler, IHttpContextAccessor contextAccessor) : BaseApiController(messageHandler, contextAccessor)
    {
        private readonly IOrders _ordersService = ordersService;
        private readonly IMessageHandler _messageHandler = messageHandler;
        private readonly IHttpContextAccessor _contextAccessor = contextAccessor;



        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] AddNewOrderDto order)
        {
            return GetServiceResponse(await _ordersService.CreateOrderAsync(order));


        }


        [HttpGet("list", Name = "GetList")]

        public async Task<IActionResult> GetList()
        {
            return GetServiceResponse(await _ordersService.GetOrdersAsync());
        }


        [HttpGet("{id}", Name = "GetOrder")]

        public async Task<IActionResult> Get(int id)
        {
            return GetServiceResponse(await _ordersService.GetOrderAsync(id));

        }



        [HttpGet("all", Name = "GetAllOrders")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            return GetServiceResponse( await _ordersService.GetAllOrdersAsync());
        }


        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrders( [FromBody] updateOrderDto updateOrder)
        {
            return GetServiceResponse(await _ordersService.UpdateOrder(updateOrder));
        }



    }
}
