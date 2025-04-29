using log4net;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.Extensions;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.GoogleAuthentication;
using onlineShopping.Services.Interface;

namespace onlineShopping.Services
{
    public class UserAuthService : IUserAuthService
    {


        private readonly UserManager<User> _userManager;
        private readonly StoreContext _storeContext;
        private readonly IGoogleAuthService _googleAuthService;
        private readonly IEmailService _emailService;
        private readonly IMessageHandler _messageHandler;
        private readonly TokenService _tokenService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ILog _logger;


        public UserAuthService(IEmailService emailServices,UserManager<User> userManager, StoreContext storeContext,IGoogleAuthService googleAuthService, IMessageHandler messageHandler, TokenService tokenService, IHttpContextAccessor contextAccessor)
        {
            _emailService = emailServices;

            _userManager = userManager;
            _storeContext = storeContext;
            _logger = LogManager.GetLogger(typeof(UserAuthService));
            _messageHandler = messageHandler;
            _tokenService = tokenService;
            _googleAuthService = googleAuthService;
            _contextAccessor = contextAccessor;
        }

        public async Task<ServiceResponse<UserDto>> SignInWithGoogle(GoogleSignInVM model)
        {
            var response = await  _googleAuthService.GoogleSignIn(model);

            if(response.Errors.Any())
            return _messageHandler.GetServiceResponse<UserDto>(ErrorMessage.ServerInternalError,null, "");


            var user = (User)response.Result;
            var jwtResponse = await _tokenService.GenerateToken(user);


            var userBasket = await RetriveBasket(user.UserName);
            var anonBasket = await RetriveBasket(_contextAccessor.HttpContext.Request.Cookies["buyerId"]);

            if (anonBasket != null)
            {
                if (userBasket != null) _storeContext.Baskets.Remove(userBasket);
                anonBasket.ByuerId = user.UserName;
                _contextAccessor.HttpContext.Response.Cookies.Delete("buyerId");
                await _storeContext.SaveChangesAsync();

            }


            var data = new UserDto
            {
                Token = jwtResponse,
                Email = user.Email,
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto(),

            };

            await _userManager.AddToRoleAsync(user, "Member");


            //var responseemail = await _emailService.SendEmailAsync(new EmailSetting
            //{
            //    Email = user.Email,
            //    Subject = "Welcome",
            //    Body = $"Welcome  to our service!"
            //});

            return _messageHandler.GetServiceResponse<UserDto>(SuccessMessage.UserSuccessfullyRegistered, data, "Sucesss Login");

        }






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
