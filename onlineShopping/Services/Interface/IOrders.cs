using onlineShopping.DTOs.Orders;
using onlineShopping.DTOs.Product;
using onlineShopping.Entities.OrderAggregate;
using onlineShopping.RequestHelpers;

namespace onlineShopping.Services.Interface
{
    public interface IOrders
    {


        Task<ServiceResponse<OrderResponseDto>> CreateOrderAsync(AddNewOrderDto addNewOrderDto);

        Task<ServiceResponse<List<OrderDto>>> GetOrdersAsync();

        Task<ServiceResponse<OrderDto>> GetOrderAsync(int id);

        Task<ServiceResponse<List<OrderDto>>> GetAllOrdersAsync();

        Task<ServiceResponse<OrderDto>> UpdateOrder(updateOrderDto updateOrderDto);




    }
}
