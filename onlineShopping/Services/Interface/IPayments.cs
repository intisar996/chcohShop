
using onlineShopping.DTOs;
using onlineShopping.RequestHelpers;

namespace onlineShopping.Services.Interface
{
    public interface IPayments
    {

        Task<ServiceResponse<BasketDto>> CreateOrUpdatePaymentIntent();
        Task<ServiceResponse> StripeWebhook();


    }
}
