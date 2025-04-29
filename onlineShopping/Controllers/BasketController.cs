using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.Extensions;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.Interface;

namespace onlineShopping.Controllers
{

    public class BasketController(IBasket _basket, IMessageHandler messageHandler, IHttpContextAccessor contextAccessor) : BaseApiController(messageHandler, contextAccessor)
    {
        private readonly IBasket _basket = _basket;
        private readonly IMessageHandler messageHandler = messageHandler;
        private readonly IHttpContextAccessor contextAccessor = contextAccessor;

        [HttpGet(Name="GetBasket")]

        public async Task<ActionResult<BasketDto>> GetBasket()
        {         
            return GetServiceResponse(await _basket.GetBasket());
        }



         [HttpPost] // api/basket?productId=3&&quantity=2

          public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId,int quantity)
          {
             return GetServiceResponse(await _basket.AddItemToBasket(productId, quantity));
          }   

        [HttpDelete]

        public async Task<ActionResult> RemoveBasketItem(int productId,int quantity)
        {      
            return GetServiceResponse(await _basket.DeleteItemToBasket(productId, quantity));
        }











    }  

}
