namespace onlineShopping.DTOs
{
    public class BasketDto
    {
        public int Id { get; set; }

        public string BuyerId { get; set; } = string.Empty;

        public string Test { get; set; } = string.Empty;

        public List<BasketItemDto> Items  { get; set; }
        public string PaymentIntendId { get; set; }
        public string ClientSecret { get; set; }

    }
}
