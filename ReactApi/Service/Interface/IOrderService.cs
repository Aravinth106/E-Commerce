using static ReactApi.Dto.OrderDto;

namespace ReactApi.Service.Interface
{
    public interface IOrderService
    {
        Task<Guid> CreateAsync(CreateOrderRequest request);
        Task<List<OrderResponse>> GetByUserAsync(Guid userId);
        Task CancelAsync(Guid orderId, Guid userId);
        Task UpdateStatusAsync(Guid orderId, string status);
        Task<OrderResponse> GetByIdAsync(Guid orderId, Guid userId, bool isAdmin);
    }
}
