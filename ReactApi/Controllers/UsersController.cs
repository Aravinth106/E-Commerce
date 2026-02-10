using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Dto;
using ReactApi.Service.Interface;

namespace ReactApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // POST: api/users
        [HttpPost(Name = "CreateUser")]
        public async Task<IActionResult> CreateUser(UserDto request)
        {
            var id = await _userService.CreateAsync(request);
            return CreatedAtRoute("GetUserById", new { id }, null);
        }

        // GET: api/users
        [Authorize(Roles = "User")]
        [HttpGet(Name = "GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // GET: api/users/{id}
        [HttpGet("{id:guid}", Name = "GetUserById")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // PUT: api/users/{id}
        [HttpPut("{id:guid}", Name = "UpdateUser")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserRequest request)
        {
            var updated = await _userService.UpdateAsync(id, request);
            if (!updated)
                return NotFound();

            return NoContent();
        }
    }
}
