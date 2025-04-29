namespace onlineShopping.DTOs
{
    public class BasketItemDto
    {
        public int  ProductId { get; set; }

        public string NameEn { get; set; } = string.Empty;

        public string NameAr { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string PicterUrl { get; set; } = string.Empty;
        public string chchoType { get; set; } = string.Empty;

        public string Pbrand { get; set; } = string.Empty;

        public int Quantity { get; set; }
    }
}