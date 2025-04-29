namespace onlineShopping.DTOs.Orders
{
    public class OrderItemDto
    {

        public int ProductId { get; set; }

        public string NameEn { get; set; } 
        public string NameAr { get; set; }
        public required string PictuerUrl { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }

    }
}
