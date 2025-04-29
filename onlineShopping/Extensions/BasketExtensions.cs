using Microsoft.EntityFrameworkCore;
using onlineShopping.DTOs;
using onlineShopping.Entities;
using System.Linq;

namespace onlineShopping.Extensions
{
    public static class BasketExtensions
    {


         public static BasketDto MapBasketToDto(this Basket basket)
        {
            //if(basket == null) return null;

            return new BasketDto
            {

                Id = basket.Id,
                BuyerId = basket.ByuerId,
                PaymentIntendId = basket.PaymentIntendId,
                ClientSecret = basket.ClientSecret,
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
        }







        public static IQueryable<Basket> RetriveBasketWithItems(this IQueryable<Basket> basket, string buyerId)
        {
            return basket.Include(i => i.Items).ThenInclude(p => p.Product).Where(b =>b.ByuerId == buyerId);
        }






    }
}
