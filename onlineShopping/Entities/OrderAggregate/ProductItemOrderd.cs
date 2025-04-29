using Microsoft.EntityFrameworkCore;

namespace onlineShopping.Entities.OrderAggregate
{
    [Owned]
    public class ProductItemOrderd
    {
        public int ProductId { get; set; }
        public string NameEn { get; set; }
        public string NameAr { get; set; }

        public string PictureUrl { get; set; }
    }
}
