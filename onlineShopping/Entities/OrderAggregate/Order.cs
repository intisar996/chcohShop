using System.ComponentModel.DataAnnotations;

namespace onlineShopping.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }
        [Required]
        public ShippingAddress ShippingAddress { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public List<OrderItem> OrderItems { get; set; }

        public decimal Subtotal { get; set; }

        public decimal DeliveryFee { get; set; }

        public PaymentStatus PaymentStatus { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentIntendId { get; set; }


        public decimal GetTotal()
        {
            return Subtotal + DeliveryFee;
        }



    }
}
