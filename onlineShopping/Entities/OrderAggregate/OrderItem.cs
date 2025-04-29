namespace onlineShopping.Entities.OrderAggregate
{
    public class OrderItem
    {

        public int Id { get; set; }

        public ProductItemOrderd ItemOrderd { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }
    }
}
