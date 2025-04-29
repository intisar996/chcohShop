using static onlineShopping.Entities.Product;

namespace onlineShopping.DTOs.Product
{
    public class ProductFilterDto
    {
        public List<string> types { get; set; }

        public List<string> brands { get; set; }
    }
}
