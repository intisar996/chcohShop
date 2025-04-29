using Azure.Core;
using Azure;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Extensions;
using onlineShopping.DTOs.Product;
using Microsoft.AspNetCore.Mvc;
using onlineShopping.Services.Interface;

namespace onlineShopping.Services
{
    public class BasketService : IBasket
    {
        private readonly IMessageHandler _messageHandler;
        private readonly StoreContext _storeContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        // حقن IHttpContextAccessor و StoreContext
        public BasketService(StoreContext context, IMessageHandler messageHandler, IHttpContextAccessor httpContextAccessor)
        {
            _storeContext = context;
            _messageHandler = messageHandler;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<ServiceResponse<BasketDto>> GetBasket()
        {
            try
            {
                var basket = await RetriveBasket(GetBuyerId());

                if (basket is null)
                {
                    return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.NotFound, null, "Basket Not Found");
                }

                var basketDto = new BasketDto
                {
                    Id = basket.Id,
                    BuyerId = basket.ByuerId,
                    Items = basket.Items.Select(item => new BasketItemDto
                    {
                        ProductId = item.ProductId,
                        NameEn = item.Product.NameEn,
                        NameAr = item.Product.NameAr,
                        Price = item.Product.Price,
                        PicterUrl = item.Product.PicterUrl,
                        chchoType = item.Product.Type.ToString(),
                        Pbrand = item.Product.Brand,
                        Quantity = item.Quantity
                    }).ToList()
                };

                return _messageHandler.GetServiceResponse(SuccessMessage.Retrieved, basketDto);
            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.ServerInternalError, null, "GetListBrandTypeAsync");

            }
        }






        public async Task<ServiceResponse<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            try
            {
                // get baske   ||   // create basket
                var basket = await RetriveBasket(GetBuyerId());

                // create basket
                if (basket is null) basket = CreateBasket();

                // get product
                var product = await _storeContext.Products.FindAsync(productId);
                if (product is null)
                {
                    return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.NotFound, null, "product Not Found");
                };
                // Add item
                basket.AddItem(product, quantity);

                // save change
                var result = await _storeContext.SaveChangesAsync() > 0;

                var basketDto = new BasketDto
                {
                    Id = basket.Id,
                    BuyerId = basket.ByuerId,
                    Items = basket.Items.Select(item => new BasketItemDto
                    {
                        ProductId = item.ProductId,
                        NameEn = item.Product.NameEn,
                        NameAr = item.Product.NameAr,
                        Price = item.Product.Price,
                        PicterUrl = item.Product.PicterUrl,
                        chchoType = item.Product.Type.ToString(),
                        Pbrand = item.Product.Brand,
                        Quantity = item.Quantity
                    }).ToList()
                };

                if (basketDto is null)
                {
                    return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.NotFound, null, "Some thing wrong");

                }


                return _messageHandler.GetServiceResponse(SuccessMessage.Retrieved, basketDto);

            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.ServerInternalError, null, "GetListBrandTypeAsync");

            }
        }




        public async Task<ServiceResponse<BasketDto>> DeleteItemToBasket(int productId, int quantity)
        {
            try
            {

                // get basket

                var basket = await RetriveBasket(GetBuyerId());
                if (basket is null)
                {
                    return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.NotFound, null, "Basket Not Found");
                }

                // remove item or reduce quantity
                basket.RemoveItem(productId, quantity);
                // save changes
                var result = await _storeContext.SaveChangesAsync() > 0;




                return _messageHandler.GetServiceResponse<BasketDto>(SuccessMessage.Retrieved, null);

            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<BasketDto>(ErrorMessage.ServerInternalError, null, "GetListBrandTypeAsync");

            }
        }

        private async Task<Basket> RetriveBasket(string buyerId)
        {

            if (string.IsNullOrWhiteSpace(buyerId))
            {
                _httpContextAccessor.HttpContext.Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _storeContext.Baskets
                 .Include(i => i.Items)
                 .ThenInclude(p => p.Product)
                 .FirstOrDefaultAsync(x => x.ByuerId == buyerId);
        }




        private string GetBuyerId()
        {
            // check if we have user name or cookie to get buyer id 
            return _httpContextAccessor.HttpContext.User.Identity?.Name ?? _httpContextAccessor.HttpContext.Request.Cookies["buyerId"];
        }



        private Basket CreateBasket()
        {

            var buyerId = _httpContextAccessor.HttpContext.User.Identity?.Name;

            // mean if not login  buyerId = null so will create buyerId
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30), SameSite = SameSiteMode.None, Secure = true };
                _httpContextAccessor.HttpContext.Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            // Create New Basket
            var basket = new Basket { ByuerId = buyerId };

            _storeContext.Baskets.Add(basket);
            return basket;


        }

      
    }
}
