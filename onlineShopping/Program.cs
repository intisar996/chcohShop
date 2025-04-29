
using onlineShopping.Data;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Middleware;
using onlineShopping.Entities;
using Microsoft.AspNetCore.Identity;
using onlineShopping.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using onlineShopping.Services.GoogleAuthentication;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.RequestHelpers;
using onlineShopping.Services.Interface;
using onlineShopping.Extensions;


namespace onlineShopping
{
    public class Program
    {
        public static  async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            builder.Services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            // Add services to the container.

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "Put Bearer + your token in the box below",
                    Reference = new OpenApiReference
                    {
                         Id = JwtBearerDefaults.AuthenticationScheme,
                         Type = ReferenceType.SecurityScheme
                    }
                };

                c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {

                        jwtSecurityScheme, Array.Empty<string>()
                    }
                });
            } );

            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
            builder.Services.AddDbContext<StoreContext>(opt =>
            {
                opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddCors();

            // Add Identity
            builder.Services.AddIdentityCore<User>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
                

            } )
                .AddRoles<Role>()
                .AddEntityFrameworkStores<StoreContext>();

            // Autn and Authroization
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                   .AddJwtBearer(otp =>
                   {
                       otp.TokenValidationParameters = new TokenValidationParameters
                       {
                           ValidateIssuer = false,
                           ValidateAudience = false,
                           ValidateLifetime = true,
                           ValidateIssuerSigningKey = true,
                           IssuerSigningKey = new SymmetricSecurityKey(Encoding
                           .UTF8.GetBytes(builder.Configuration["JWTSetting:Tokenkey"]))
                       };
                   });


            builder.Services.AddAuthorization();
            builder.Services.AddScoped<TokenService>();
            builder.Services.AddScoped<PaymentExtension>();

            builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            builder.Services.AddControllers();


            builder.Services.AddTransient<IUserAccount, UserAccountService>();
            builder.Services.AddTransient<IMessageHandler, MessageHandler>();
            builder.Services.AddTransient<IProduct, ProductService>();
            builder.Services.AddScoped<ImageService>();
            builder.Services.AddTransient<IBasket, BasketService>();
            builder.Services.AddScoped<IEmailService, EmailServices>();
            builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            builder.Services.AddScoped<IUserAuthService, UserAuthService>();
            builder.Services.AddScoped<IOrders, OrderService>();
            builder.Services.AddScoped<IPayments, PaymentService>();
            builder.Services.AddHttpContextAccessor();



            builder.Services.Configure<GoogleAuthConfig>(builder.Configuration.GetSection("Google"));



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseMiddleware<ExpectionMiddleware>();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
                });
            }


            app.UseCors(opt =>
            {
                opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
            });

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();



          await DbInitialzier.InitDb(app);


            app.Run();
        }
    }
}