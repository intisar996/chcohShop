
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.Extensions;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services;
using onlineShopping.Services.Interface;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace onlineShopping.Controllers
{

    public class AccountController(IUserAccount userAccount,IUserAuthService googleAuthService,UserManager<User> userManager, TokenService tokenService, StoreContext context, IMessageHandler messageHandler, IHttpContextAccessor contextAccessor) : BaseApiController(messageHandler,contextAccessor)
    {
        private readonly IUserAccount _userAccount = userAccount;
        private readonly IUserAuthService _googleAuthService = googleAuthService;
        private readonly UserManager<User> _userManager = userManager;
        private readonly TokenService _tokenService = tokenService;
        private readonly StoreContext _context = context;
        private readonly IMessageHandler messageHandler = messageHandler;
        private readonly IHttpContextAccessor contextAccessor = contextAccessor;


        [HttpPost("login")]

        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {

            /*  var user = await _userManager.FindByNameAsync(loginDto.Username);

              if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                  return Unauthorized();

              var userBasket = await RetriveBasket(loginDto.Username);
              var anonBasket = await RetriveBasket(Request.Cookies["buyerId"]);

              if (anonBasket != null)
              {
                  if (userBasket != null) _context.Baskets.Remove(userBasket);
                  anonBasket.ByuerId = user.UserName;
                  Response.Cookies.Delete("buyerId");
                  await _context.SaveChangesAsync();

              }

              return new UserDto
              {
                  Email = user.Email,
                  Token = await _tokenService.GenerateToken(user),
                  Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto(),
              };  */

            return GetServiceResponse(await _userAccount.LoginAsync(loginDto)); 


        }


        [HttpPost("register")]

        public async Task<ActionResult> Register([FromBody]RegisterDto registerDto)
        {
            //if (ModelState.AddModelError(error.Code, error.Description));

            return GetServiceResponse(await _userAccount.RegisterAsync(registerDto));
        }




        [HttpPost("googleSignIn")]

        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInVM model)
        {
           
                return GetServiceResponse(await _googleAuthService.SignInWithGoogle(model));
            
          
        }







        [Authorize]
        [HttpGet("currentUser")]

        public async Task<ActionResult<UserDto>> GetCurrnetUser()
        {
            return GetServiceResponse(await _userAccount.GetCurrnetUserAsync());

        }






        [Authorize]
        [HttpGet("saveAddress")]
        public async Task<ActionResult<Address>> GetSavedAddress()
        {
            return GetServiceResponse(await _userAccount.RetriveSaveAddres());

        }








        private async Task<Basket> RetriveBasket(string buyerId)
        {

            if (string.IsNullOrWhiteSpace(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _context.Baskets
                 .Include(i => i.Items)
                 .ThenInclude(p => p.Product)
                 .FirstOrDefaultAsync(x => x.ByuerId == buyerId);
        }



     

    }  
}
