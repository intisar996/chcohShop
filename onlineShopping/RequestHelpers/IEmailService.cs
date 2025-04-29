using onlineShopping.DTOs;
using onlineShopping.DTOs.Product;

namespace onlineShopping.RequestHelpers
{
    public interface IEmailService
    {

        Task<ServiceResponse> SendEmailAsync(EmailSetting emailSetting);

    }
}
