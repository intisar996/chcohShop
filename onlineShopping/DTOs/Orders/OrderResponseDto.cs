using onlineShopping.Entities.OrderAggregate;

namespace onlineShopping.DTOs.Orders
{
    public class OrderResponseDto
    {

        public int Id { get; set; }
        public PaymentStatus  paymentStatus { get; set; }
        public string OrderStatus { get; set; }

        //    public string OrderRoute { get; set; }
        //}

    }
}
