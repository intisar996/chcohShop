using Azure.Core;
using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.Interface;
using static System.Runtime.InteropServices.JavaScript.JSType;
using onlineShopping.Extensions;
using onlineShopping.DTOs.Orders;

namespace onlineShopping.Services
{
    public class UserAccountService : IUserAccount
    {
        private readonly StoreContext _storeContext;
        private readonly UserManager<User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IMessageHandler _messageHandler;
        private readonly TokenService _tokenService;



        public UserAccountService(StoreContext storeContext,UserManager<User> userManager, IHttpContextAccessor contextAccessor, IMessageHandler messageHandler,TokenService tokenService )
        {
            _storeContext = storeContext;
            _userManager = userManager;
            _contextAccessor = contextAccessor;
            _messageHandler = messageHandler;
            _tokenService = tokenService;
        }

        public async Task<ServiceResponse<UserDto>> GetCurrnetUserAsync()
        {
            try
            {
                var userName = _contextAccessor.HttpContext.User.Identity?.Name;
                var user = await _userManager.FindByNameAsync(userName);

                var userBasket = await RetriveBasket(userName);


                var result =  new UserDto
                {
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user),
                    Basket = userBasket?.MapBasketToDto(),
                };

                return _messageHandler.GetServiceResponse<UserDto>(SuccessMessage.Retrieved, result, "GetCurrnetUserAsync");

            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<UserDto>(ErrorMessage.NotFound, null, "GetCurrnetUserAsync");

            }
        }

        // Login 
        public async Task<ServiceResponse<UserDto>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(loginDto.Username);

                if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                    return _messageHandler.GetServiceResponse<UserDto>(ErrorMessage.Unauthorized,null, "Unauthorized");

                var userBasket = await RetriveBasket(loginDto.Username);
                var anonBasket = await RetriveBasket(_contextAccessor.HttpContext.Request.Cookies["buyerId"]);

                if (anonBasket != null)
                {
                    if (userBasket != null) _storeContext.Baskets.Remove(userBasket);
                    anonBasket.ByuerId = user.UserName;
                    _contextAccessor.HttpContext.Response.Cookies.Delete("buyerId");
                    await _storeContext.SaveChangesAsync();

                }

                var users = new UserDto
                {
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user),
                    Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto(),
                };

                if(users is null)
                {
                    return _messageHandler.GetServiceResponse<UserDto>(ErrorMessage.NotFound,null, "SomeThing Wrong");
                }

                return _messageHandler.GetServiceResponse<UserDto>(SuccessMessage.Retrieved, users, "Success Login");

            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<UserDto>(ErrorMessage.ServerInternalError,null, "Login");

            }
        }

        //Register
        public async Task<ServiceResponse> RegisterAsync(RegisterDto registerDto)
        {

            try
            {
                var user = new User
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                };

                var result = await _userManager.CreateAsync(user, registerDto.Password);
                if (!result.Succeeded)
                {
                    // قائمة لتخزين الأخطاء
                    var errors = result.Errors.Select(e => $"{e.Code}: {e.Description}").ToList();

                    // إذا كانت القائمة فارغة أو لا توجد أخطاء
                    if (errors.Count == 0)
                    {
                        errors.Add("An unknown validation error occurred.");
                    }

                    // دمج الأخطاء في رسالة واحدة
                    var errorsMessage = string.Join("; ", errors);

                    // إرجاع الاستجابة مع الأخطاء
                    return _messageHandler.GetServiceResponse(
                        ErrorMessage.InvalidInput,
                        "Validation error occurred",
                        errorsMessage
                    );
                }




                await _userManager.AddToRoleAsync(user, "Member");
                return _messageHandler.GetServiceResponse(SuccessMessage.UserSuccessfullyRegistered, "Sucesss Register" );


            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse(ErrorMessage.ServerInternalError,"SomeThing Wrong Try Register Again");

            }
        }

        // Retrive Save Address
        public async Task<ServiceResponse<Address>> RetriveSaveAddres()
        {

            try
            {
                var userName = _contextAccessor.HttpContext.User.Identity?.Name;

                var result = await _userManager.Users
                           .Where(u => u.UserName == userName)
                           .Select(user => user.Address)
                           .FirstOrDefaultAsync();

                if(result is null)
                {
                    return _messageHandler.GetServiceResponse<Address>(ErrorMessage.ServerInternalError, null, "No Address Saved");

                }

                return _messageHandler.GetServiceResponse<Address>(SuccessMessage.Retrieved, result, "Success RetriveSaveAddres");


            }
            catch
            {
                return _messageHandler.GetServiceResponse<Address>(ErrorMessage.ServerInternalError,null, "Something wrong when RetriveSaveAddres");

            }
        }

        // Retrive Basket
        private async Task<Basket> RetriveBasket(string buyerId)
        {

            if (string.IsNullOrWhiteSpace(buyerId))
            {
                _contextAccessor.HttpContext.Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _storeContext.Baskets
                 .Include(i => i.Items)
                 .ThenInclude(p => p.Product)
                 .FirstOrDefaultAsync(x => x.ByuerId == buyerId);
        }

    }
}
