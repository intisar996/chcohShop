using AutoMapper;
using onlineShopping.DTOs.Product;
using onlineShopping.Entities;

namespace onlineShopping.RequestHelpers
{
    public class MappingProfiles : Profile
    {

        public MappingProfiles()
        {
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProduct, Product>();
        }
    }

}
