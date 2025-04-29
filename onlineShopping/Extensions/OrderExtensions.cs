using Microsoft.EntityFrameworkCore;
using onlineShopping.DTOs.Orders;
using onlineShopping.Entities.OrderAggregate;

namespace onlineShopping.Extensions
{
    public static class OrderExtensions
    {


        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query
                 .Select(order => new OrderDto
                 {
                     Id = order.Id,
                     BuyerId = order.BuyerId,
                     OrderDate = order.OrderDate,
                     ShippingAddress = order.ShippingAddress,
                     DeliveryFee = order.DeliveryFee,
                     PaymentStatus = order.PaymentStatus.ToString(),
                     OrderStatus = order.OrderStatus,
                     Subtotal = order.Subtotal,
                     Total = order.GetTotal(),
                     OrderItems = order.OrderItems.Select(item => new OrderItemDto
                     {
                         ProductId = item.ItemOrderd.ProductId,
                         NameEn = item.ItemOrderd.NameEn,
                         NameAr = item.ItemOrderd.NameAr,
                         PictuerUrl = item.ItemOrderd.PictureUrl,
                         Price = item.Price,
                         Quantity = item.Quantity
                     }).ToList()
                 }).AsNoTracking();





        }
    }
}
