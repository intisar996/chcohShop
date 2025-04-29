using onlineShopping.DTOs.Product;
using onlineShopping.Entities;
using onlineShopping.RequestHelpers;

namespace onlineShopping.Services.Interface
{
    public interface IProduct
    {
        Task<ServiceResponse<GetProductListDto>> GetProductAsync(int productId);

        Task<ServiceResponse<PageList<GetProductListDto>>> GetProductListAsync(ProductParams productParams);

        Task<ServiceResponse<ProductFilterDto>> GetListBrandTypeAsync();

        Task<ServiceResponse<Product>> CreateProduct(CreateProductDto createProduct);

        Task<ServiceResponse<Product>> UpdateProduct(UpdateProduct updateProduct);


    }
}
