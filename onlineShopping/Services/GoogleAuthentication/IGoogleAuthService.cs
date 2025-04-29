using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.RequestHelpers;

namespace onlineShopping.Services.GoogleAuthentication
{
    public interface IGoogleAuthService
    {
        Task<ServiceResponse<User>> GoogleSignIn(GoogleSignInVM model);
    }
}
