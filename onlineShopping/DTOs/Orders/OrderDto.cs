using onlineShopping.Entities.OrderAggregate;
using System.ComponentModel.DataAnnotations;

namespace onlineShopping.DTOs.Orders
{
    public class OrderDto
    {

        public int Id { get; set; }

        public string BuyerId { get; set; }
        public ShippingAddress ShippingAddress { get; set; }

        public DateTime OrderDate { get; set; }

        public List<OrderItemDto> OrderItems { get; set; }

        public decimal Subtotal { get; set; }

        public decimal DeliveryFee { get; set; }

        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }

        public decimal Total { get; set; }


    }
}
