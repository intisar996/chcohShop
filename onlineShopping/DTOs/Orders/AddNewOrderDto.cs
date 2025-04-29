using onlineShopping.Entities.OrderAggregate;

namespace onlineShopping.DTOs.Orders
{
    public class AddNewOrderDto
    {

        public int Id { get; set; }
        public bool SaveAddress { get; set; } = false;

        public ShippingAddress ShippingAddress { get; set; }

        


    }
}
