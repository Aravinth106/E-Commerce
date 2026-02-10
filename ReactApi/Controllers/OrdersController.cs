using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Service.Interface;
using System.Security.Claims;
using static ReactApi.Dto.OrderDto;

namespace ReactApi.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize] // user must be logged in
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
        {
            var orderId = await _orderService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = orderId },
                new { orderId }
            );
        }


        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized("User ID not found in token");

            var userId = Guid.Parse(userIdClaim.Value);

            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var isAdmin = role == "Admin";

            var order = await _orderService.GetByIdAsync(id, userId, isAdmin);
            return Ok(order);
        }

        [HttpGet("myOrders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);

            var orders = await _orderService.GetByUserAsync(userId);
            return Ok(orders);
        }

        [HttpPut("{orderId:guid}/cancel")]
        public async Task<IActionResult> CancelOrder(Guid orderId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);

            await _orderService.CancelAsync(orderId, userId);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{orderId:guid}/status")]
        public async Task<IActionResult> UpdateStatus(
            Guid orderId,
            UpdateOrderStatusRequest request)
        {
            await _orderService.UpdateStatusAsync(orderId, request.Status);
            return NoContent();
        }

    }
}
