using Microsoft.AspNetCore.Http;
using onlineShopping.Entities;

namespace onlineShopping.Extensions
{
    public static class ProductExtensions
    {



        // Sort By price Or Name
         public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy =null, IHttpContextAccessor httpContextAccessor = null)
        {

            var language = "en";
            if (httpContextAccessor?.HttpContext.Request.Headers.ContainsKey("Accept-Language") == true)
            {
                language = httpContextAccessor.HttpContext.Request.Headers["Accept-Language"].ToString();
            }


            if (string.IsNullOrEmpty(orderBy)) return query.OrderBy(product => language == "en" ? product.NameEn : product.NameAr);

            query = orderBy switch
            {
                "price" => query.OrderBy(product => product.Price),
                "priceDesc" => query.OrderByDescending(product => product.Price),
                _ => query.OrderBy(product => language == "en" ? product.NameEn : product.NameAr)
            };

            return query;
        }


        // Search

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm = null, IHttpContextAccessor httpContextAccessor = null)
        {
            var language = "en";
            if (httpContextAccessor?.HttpContext.Request.Headers.ContainsKey("language") == true)
            {
                language = httpContextAccessor.HttpContext.Request.Headers["language"].ToString();
            }

            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.ToLower();


            return query.Where(product => language == "en" ? product.NameEn.ToLower().Contains(lowerCaseSearchTerm) : product.NameAr.Contains(lowerCaseSearchTerm));
        }


        // Filter 
        public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands = null, string? types = null)
        {

            var brandList = new List<string>();
            var typeList  = new List<string>();

            if(!string.IsNullOrEmpty(brands))
                brandList.AddRange(brands.Split(',').ToList());

            if(!string.IsNullOrEmpty(types))
            typeList.AddRange(types.Split(',').ToList());


            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToString()));

            return query;

        }

    }
}
