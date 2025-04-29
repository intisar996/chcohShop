using AutoMapper;
using Azure;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Data;
using onlineShopping.DTOs.Product;
using onlineShopping.Entities;
using onlineShopping.Extensions;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;
using onlineShopping.Services.Interface;
using Org.BouncyCastle.Crypto;
using static onlineShopping.Entities.Product;

namespace onlineShopping.Services
{
    public class ProductService : IProduct
    {
        private readonly IMessageHandler _messageHandler;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly StoreContext _storeContext;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        // حقن IHttpContextAccessor و StoreContext
        public ProductService(StoreContext context, IHttpContextAccessor httpContextAccessor,IMessageHandler messageHandler, IMapper mapper, ImageService imageService)
        {
            _storeContext = context;
            _httpContextAccessor = httpContextAccessor;
            _messageHandler = messageHandler;
            _mapper = mapper;
            _imageService = imageService;
        }


        public async Task<ServiceResponse<ProductFilterDto>> GetListBrandTypeAsync()
        {
            try
            {
                var brands = await _storeContext.Products.Select(p => p.Brand).Distinct().ToListAsync();
                var type = await _storeContext.Products.Select(p => p.Type).Distinct().ToListAsync();
                var types = type.Select(t => Enum.GetName(typeof(ChchoType), t)).ToList();


                var result = new ProductFilterDto
                {
                    brands = brands.ToList(),
                    types = types.ToList(),
                };
                return _messageHandler.GetServiceResponse(SuccessMessage.Retrieved, result, "GetListBrandTypeAsync");

            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<ProductFilterDto>(ErrorMessage.ServerInternalError, null, "GetListBrandTypeAsync");

            }

        }

        public async Task<ServiceResponse<GetProductListDto>> GetProductAsync(int Id)
        {
            try
            {
                var query = _storeContext.Products.AsNoTracking();
                var product = await query
                                .Select(p => new GetProductListDto
                                {
                                    Id = p.Id,
                                    NameAr = p.NameAr,
                                    NameEn = p.NameEn,
                                    DescriptionAr = p.DescriptionAr,
                                    DescriptionEn = p.DescriptionEn,
                                    PicterUrl = p.PicterUrl,
                                    QuantityStock = p.QuantityStock,
                                    Price = p.Price,
                                    Fat = p.Fat,
                                    Size = p.Size,
                                    Sugar = p.Sugar,
                                    Brand = p.Brand,
                                    Type = p.Type
                                }).FirstOrDefaultAsync(p => p.Id == Id);


                if (product is null)
                {
                    return _messageHandler.GetServiceResponse<GetProductListDto>(ErrorMessage.NotFound, null, "GetProduct");
                }

                return _messageHandler.GetServiceResponse(SuccessMessage.Retrieved,product);
            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<GetProductListDto>(ErrorMessage.ServerInternalError, null, "GetProduct");
            }
        }

        public async Task<ServiceResponse<PageList<GetProductListDto>>> GetProductListAsync(ProductParams productParams)
        {
            try
            {
                var query = _storeContext.Products.AsNoTracking();
                var product =  _storeContext.Products.AsNoTracking()
                                .Sort(productParams.OrderBY)
                                .Search(productParams.SearchTerm)
                                .Filter(productParams.Brands, productParams.Types)
                                .Where(product => !product.IsDeleted)
                                .Select(product => new GetProductListDto
                                  {
                                    Id = product.Id,
                                    NameAr = product.NameAr,
                                    NameEn = product.NameEn,
                                    DescriptionAr = product.DescriptionAr,
                                    DescriptionEn = product.DescriptionEn,
                                    PicterUrl = product.PicterUrl,
                                    QuantityStock = product.QuantityStock,
                                    Price = product.Price,
                                    Fat = product.Fat,
                                    Size = product.Size,
                                    Sugar = product.Sugar,
                                    Brand = product.Brand,
                                    Type = product.Type,
                                    TypeName = product.Type.ToString()
                                });
                                 

                var products = await PageList<GetProductListDto>.ToPagedList(product, productParams.PageNumber, productParams.PageSize);

                _httpContextAccessor.HttpContext.Response.AddPaginationHeader(products.MetaData);

                return _messageHandler.GetServiceResponse(SuccessMessage.Retrieved, products);
            }
            catch (Exception ex)
            {
                return _messageHandler.GetServiceResponse<PageList<GetProductListDto>>(ErrorMessage.ServerInternalError,null, "GetProductList");
            }
        }



        public async Task<ServiceResponse<Product>> CreateProduct(CreateProductDto createProduct)
        {
            try {

                var product = _mapper.Map<Product>(createProduct);

                if (createProduct.File is not null)
                {
                    var imageResult = await _imageService.AddImageAsync(createProduct.File);

                    if (imageResult.Error is not null)
                    {

                        return _messageHandler.GetServiceResponse<Product>(ErrorMessage.ServerInternalError, null, imageResult.Error.Message);
                    }
                    product.PicterUrl = imageResult.SecureUrl.ToString();
                    product.PublicId = imageResult.PublicId;
                }

                _storeContext.Products.Add(product);

                var result = await _storeContext.SaveChangesAsync();
                return _messageHandler.GetServiceResponse<Product>(SuccessMessage.Created, null, "created product seccuess");

            }
            catch (Exception e) 
            {
                return _messageHandler.GetServiceResponse<Product>(ErrorMessage.ServerInternalError, null, "addProduct");

            }


        }


        public async Task<ServiceResponse<Product>> UpdateProduct(UpdateProduct updateProduct)
        {

            try
            {
                var product = await _storeContext.Products.FindAsync(updateProduct.Id);
                if(product is null)
                {
                    return _messageHandler.GetServiceResponse<Product>(ErrorMessage.ServerInternalError, null, "Product not found");
                }

                _mapper.Map(updateProduct, product);
                
                if(updateProduct.File is not null)
                {
                    var imageUploadResult = await _imageService.AddImageAsync(updateProduct.File);
                    if (imageUploadResult.Error is not null)
                    {

                        return _messageHandler.GetServiceResponse<Product>(ErrorMessage.ServerInternalError, null, imageUploadResult.Error.Message);
                    }

                    if(!string.IsNullOrEmpty(updateProduct.PublicId))
                        await _imageService.DeleteImageAsync(updateProduct.PublicId);
                    product.PicterUrl = imageUploadResult.SecureUrl.ToString();
                    product.PublicId = imageUploadResult.PublicId;

                }

                var result = await _storeContext.SaveChangesAsync() > 0;
                return _messageHandler.GetServiceResponse<Product>(SuccessMessage.Created, null, "update product seccuess");


            }
            catch (Exception e) 
            {
                return _messageHandler.GetServiceResponse<Product>(ErrorMessage.ServerInternalError, null, "UpdateProduct");

            }


        }
    }
}
