using onlineShopping.Entities.OrderAggregate;

namespace onlineShopping.DTOs.Orders
{
    public class updateOrderDto
    {
        public int Id { get; set; }
        public string OrderStatus { get; set; }
    }
}
