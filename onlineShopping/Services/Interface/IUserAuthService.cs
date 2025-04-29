using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.RequestHelpers;

namespace onlineShopping.Services.Interface
{
    public interface IUserAuthService
    {
        Task<ServiceResponse<UserDto>> SignInWithGoogle(GoogleSignInVM model);
    }
}
