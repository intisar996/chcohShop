using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Security;
using MailKit.Net.Smtp;
using MailKit.Net.Imap;
using onlineShopping.DTOs;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Entities;

namespace onlineShopping.RequestHelpers
{
    public class EmailServices : IEmailService
    {
        private readonly GoogleAuthConfig _googleAuthConfig;
        private readonly IMessageHandler _messageHandler;

        public EmailServices(IOptions<GoogleAuthConfig> googleAuthConfig, IMessageHandler messageHandler)
        {
            _googleAuthConfig = googleAuthConfig.Value;
            _messageHandler = messageHandler;
        }

        /// <summary>
        /// Authenticate and return OAuth2 mechanism for MailKit
        /// </summary>
        private async Task<SaslMechanismOAuthBearer> AuthenticateAsync(string email)
        {
            var clientSecrets = new ClientSecrets
            {
                ClientId = _googleAuthConfig.ClientId,
                ClientSecret = _googleAuthConfig.ClientSecret
            };

            var codeFlow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                DataStore = new FileDataStore("CredentialCacheFolder", false),
                Scopes = new[] { "https://mail.google.com/" },
                ClientSecrets = clientSecrets,
                LoginHint = email
            });

            var authCode = new AuthorizationCodeInstalledApp(codeFlow, new LocalServerCodeReceiver());
            var credential = await authCode.AuthorizeAsync(email, CancellationToken.None);

            if (credential.Token.IsStale)
                await credential.RefreshTokenAsync(CancellationToken.None);

            return new SaslMechanismOAuthBearer(credential.UserId, credential.Token.AccessToken);
        }

        /// <summary>
        /// Send an email using the authenticated account
        /// </summary>
        public async Task<ServiceResponse> SendEmailAsync(EmailSetting emailSetting)
        {
            try
            {
                // Authenticate and get the OAuth2 mechanism
                var oauth2 = await AuthenticateAsync("entisar996you@gmail.com");

                // Prepare the email message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Your Name", "entisar996you@gmail.com"));
                message.To.Add(new MailboxAddress(emailSetting.Email, emailSetting.Email));
                message.Subject = emailSetting.Subject;
                message.Body = new TextPart("plain") { Text = emailSetting.Body };

                // Send the email using MailKit's SmtpClient
                using var smtpClient = new SmtpClient();
                await smtpClient.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                await smtpClient.AuthenticateAsync(oauth2);
                await smtpClient.SendAsync(message);
                await smtpClient.DisconnectAsync(true);

                return _messageHandler.GetServiceResponse(SuccessMessage.Approved, "Email sent successfully.");
            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse(ErrorMessage.InvalidInput, ex.Message);
            }
        }
    }
}
