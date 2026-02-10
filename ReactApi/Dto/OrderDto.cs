namespace ReactApi.Dto
{
    public class OrderDto
    {
        public record CreateOrderRequest(
            Guid UserId,
            List<CreateOrderItemRequest> Items
        );

        public record CreateOrderItemRequest(
            Guid ProductId,
            int Quantity
        );

        public record OrderItemResponse(
             Guid ProductId,
             string ProductName,
             int Quantity,
             decimal Price
         );

        public record OrderResponse(
            Guid OrderId,
            DateTime OrderDate,
            string Status,
            decimal TotalAmount,
            List<OrderItemResponse> Items
        );

        public record UpdateOrderStatusRequest(
            string Status
        );

    }
}
