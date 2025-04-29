using log4net;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using onlineShopping.Data;
using onlineShopping.DTOs;
using onlineShopping.Entities;
using onlineShopping.Enums;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace onlineShopping.Services.GoogleAuthentication
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly StoreContext _storeContext;
        private readonly GoogleAuthConfig _googleAuthConfig;
        private readonly IMessageHandler _messageHandler;

        private ILog _logger;


        public GoogleAuthService(UserManager<User> userManager,StoreContext storeContext, IOptions<GoogleAuthConfig> googleAuthConfig,IMessageHandler messageHandler)
        {
           _userManager = userManager;
            _storeContext = storeContext;
            _googleAuthConfig = googleAuthConfig.Value;
            _logger = LogManager.GetLogger(typeof(GoogleAuthService));
            _messageHandler = messageHandler;
        }

        public async Task<ServiceResponse<User>> GoogleSignIn(GoogleSignInVM model)
        {
            Payload payload = new();

            try
            {
                payload = await ValidateAsync(model.IdToken, new ValidationSettings
                {
                    Audience = new[] { _googleAuthConfig.ClientId }
                });

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return  _messageHandler.GetServiceResponse<User>(ErrorMessage.ServerInternalError, null, ex.Message);
            }

            var userToBeCreated = new CreateUserFromSocialLogin
            {
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Email = payload.Email,
                UserName = payload.Email,
                ProfilePicture = payload.Picture,
                LoginProviderSubject = payload.Subject,

            };

            var user = await _userManager.CreateUserFromSocialLogin(_storeContext, userToBeCreated, LoginProvider.Google);

            if (user is not null)
                return _messageHandler.GetServiceResponse<User>(SuccessMessage.Retrieved, user, "Success ");

            else
                return _messageHandler.GetServiceResponse<User>(ErrorMessage.ServerInternalError,null, "Unable to link a Local User to a Provider");
        }
    }
}
