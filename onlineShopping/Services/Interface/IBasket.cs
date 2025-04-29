using onlineShopping.DTOs;
using onlineShopping.RequestHelpers;

namespace onlineShopping.Services.Interface
{
    public interface IBasket
    {


        Task<ServiceResponse<BasketDto>> GetBasket();

        Task<ServiceResponse<BasketDto>> AddItemToBasket(int productId,int quantity);

        Task<ServiceResponse<BasketDto>> DeleteItemToBasket(int productId, int quantity);


    }
}
