using Azure;
using onlineShopping.Entities;
using onlineShopping.RequestHelpers;
using System.Text.Json;

namespace onlineShopping.Extensions
{
    public static class HttpExtensions
    {
         
         public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Append("Pagination", JsonSerializer.Serialize(metaData, options));
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");

        }
    }
}
