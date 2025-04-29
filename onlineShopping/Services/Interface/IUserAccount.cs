using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.RequestHelpers;

namespace onlineShopping.Services.Interface
{
    public interface IUserAccount
    {


        public Task<ServiceResponse<UserDto>>  LoginAsync(LoginDto loginDto);

        public Task<ServiceResponse> RegisterAsync(RegisterDto registerDto);

        public Task<ServiceResponse<UserDto>> GetCurrnetUserAsync();

        public Task<ServiceResponse<Address>> RetriveSaveAddres();
    }
}
