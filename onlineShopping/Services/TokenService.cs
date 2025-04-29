using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using onlineShopping.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace onlineShopping.Services
{
    public class TokenService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;

        public TokenService(UserManager<User> userManager, IConfiguration config )
        {
             _userManager = userManager;
             _config = config;
        }



       public async Task<string> GenerateToken(User user)
        {

              if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.UserName))
              return string.Empty;  


              // Pattern Matching

               //if(user is {Email:null or "", UserName:null or ""})
               // return string.Empty;


              // Claim For Header JWT
            var claims = new List<Claim>
            {
               new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach(var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }



            // Signature


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSetting:Tokenkey"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenOptions = new JwtSecurityToken(
                issuer: null,
                audience:null,
                claims:claims,
                expires:DateTime.Now.AddDays(7),
                signingCredentials: creds
             );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        } 



    }
}
