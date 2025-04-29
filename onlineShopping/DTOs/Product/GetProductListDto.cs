using static onlineShopping.Entities.Product;
using System.ComponentModel.DataAnnotations;

namespace onlineShopping.DTOs.Product
{
    public class GetProductListDto
    {
        public int Id { get; set; }

        public string NameEn { get; set; } = string.Empty;

        public string NameAr { get; set; } = string.Empty;

        public string DescriptionEn { get; set; } = string.Empty;

        public string DescriptionAr { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string PicterUrl { get; set; } = string.Empty;
        public ChchoType  Type { get; set; }
        public string TypeName { get; set; }

        public string Brand { get; set; } = string.Empty;
        public int QuantityStock { get; set; }
        public string Size { get; set; } = string.Empty;
        public string Sugar { get; set; } = string.Empty;
        public string Fat { get; set; } = string.Empty;

    }
}
