﻿using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace onlineShopping.Middleware
{
    public class ExpectionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExpectionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExpectionMiddleware(RequestDelegate next, ILogger<ExpectionMiddleware> logger, IHostEnvironment env)
        {
             _next = next;
              _logger = logger;
              _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                var response = new ProblemDetails
                {
                    Status = 500,
                    Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
                    Title = ex.Message,
                };

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);

            }
        }


    }
}
