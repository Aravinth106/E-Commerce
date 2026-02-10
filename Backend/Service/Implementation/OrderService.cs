using Microsoft.EntityFrameworkCore;
using ReactApi.Data;
using ReactApi.Entities;
using ReactApi.Service.Interface;
using static ReactApi.Dto.OrderDto;

namespace ReactApi.Service.Implementation
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateAsync(CreateOrderRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            decimal totalAmount = 0;
            var orderId = Guid.NewGuid();

            var order = new order
            {
                id = orderId,
                user_id = request.UserId,
                order_date = DateTime.UtcNow,
                created_at = DateTime.UtcNow,
                status = "Pending"
            };

            foreach (var item in request.Items)
            {
                var product = await _context.products
                    .FirstOrDefaultAsync(p => p.id == item.ProductId && p.is_active == true);

                if (product == null)
                    throw new KeyNotFoundException("Product not found");

                if (product.stock_quantity < item.Quantity)
                    throw new ArgumentException("Insufficient stock");

                // calculate
                var lineTotal = product.price * item.Quantity;
                totalAmount += lineTotal;

                // reduce stock
                product.stock_quantity -= item.Quantity;

                var orderItem = new order_item
                {
                    id = Guid.NewGuid(),
                    order_id = orderId,
                    product_id = product.id,
                    quantity = item.Quantity,
                    price = product.price // unit price
                };

                order.OrderItems.Add(orderItem);
            }

            order.total_amount = totalAmount;

            _context.orders.Add(order);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return orderId;
        }
        public async Task<OrderResponse> GetByIdAsync(Guid orderId, Guid userId, bool isAdmin)
        {
            var orderQuery = _context.orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.product)
                .AsQueryable();

            if (!isAdmin)
            {
                orderQuery = orderQuery.Where(o => o.user_id == userId);
            }

            var order = await orderQuery.FirstOrDefaultAsync(o => o.id == orderId);

            if (order == null)
                throw new Exception("Order not found");

            return new OrderResponse(
                order.id,
                order.order_date,
                order.status,
                order.total_amount,
                order.OrderItems.Select(i => new OrderItemResponse(
                    i.product_id,
                    i.product.name,
                    i.quantity,
                    i.price
                )).ToList()
            );
        }
        public async Task<List<OrderResponse>> GetByUserAsync(Guid userId)
        {
            return await _context.orders
                .Where(o => o.user_id == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.product)
                .OrderByDescending(o => o.created_at)
                .Select(o => new OrderResponse(
                    o.id,
                    o.order_date,
                    o.status,
                    o.total_amount,
                    o.OrderItems.Select(oi => new OrderItemResponse(
                        oi.product_id,
                        oi.product.name,
                        oi.quantity,
                        oi.price
                    )).ToList()
                ))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task CancelAsync(Guid orderId, Guid userId)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            var order = await _context.orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.id == orderId && o.user_id == userId);

            if (order == null)
                throw new Exception("Order not found");

            if (order.status != "Pending")
                throw new Exception("Only pending orders can be cancelled");

            // Rollback stock
            foreach (var item in order.OrderItems)
            {
                var product = await _context.products
                    .FirstOrDefaultAsync(p => p.id == item.product_id);

                if (product != null)
                {
                    product.stock_quantity += item.quantity;
                }
            }

            order.status = "Cancelled";

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }

        public async Task UpdateStatusAsync(Guid orderId, string newStatus)
        {
            var order = await _context.orders
                .FirstOrDefaultAsync(o => o.id == orderId);

            if (order == null)
                throw new Exception("Order not found");

            newStatus = newStatus.Trim();

            var allowed = order.status switch
            {
                "Pending" => newStatus is "Paid" or "Cancelled",
                "Paid" => newStatus == "Shipped",
                _ => false
            };

            if (!allowed)
                throw new Exception(
                    $"Invalid status transition from {order.status} to {newStatus}"
                );

            order.status = newStatus;
            await _context.SaveChangesAsync();
        }


    }
}
