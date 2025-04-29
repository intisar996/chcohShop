using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs.Product;
using onlineShopping.Entities;
using onlineShopping.Extensions;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.Interface;
using System.Text.Json;
using static onlineShopping.Entities.Product;


namespace onlineShopping.Controllers
{

    public class ProductsController(IProduct _productservice,IMessageHandler  messageHandler, IHttpContextAccessor contextAccessor, StoreContext storeContext) : BaseApiController(messageHandler, contextAccessor)
    {

        private readonly IMessageHandler  _messageHandler = messageHandler;

        private readonly IProduct _productservice = _productservice;

          private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly StoreContext _storeContext = storeContext;

        // حقن IHttpContextAccessor و StoreContext
       

        [HttpGet]
         public async Task<IActionResult> GetProducts([FromQuery]ProductParams productParams)
        {
            return GetServiceResponse(await _productservice.GetProductListAsync(productParams)); 
        }


        [HttpGet("{id}")]

         public  async Task<ActionResult<GetProductListDto>> GetProduct(int id)
        {
            return GetServiceResponse(await _productservice.GetProductAsync(id));

        }


           [HttpGet("filters")]

           public async Task<ActionResult<ProductFilterDto>> GetFilter()
           {
                 return GetServiceResponse(await _productservice.GetListBrandTypeAsync());


           }


        [Authorize(Roles ="Admin")]
        [HttpPost]


        public async Task<ActionResult<Product>> create([FromForm]CreateProductDto createProduct)
        {
            return GetServiceResponse(await _productservice.CreateProduct(createProduct));

        }


        [Authorize(Roles = "Admin")]
        [HttpPut]


        public async Task<ActionResult<Product>> update([FromForm] UpdateProduct updateProduct)
        {
            return GetServiceResponse(await _productservice.UpdateProduct(updateProduct));

        }




    }
}
