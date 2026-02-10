using Microsoft.EntityFrameworkCore;
using ReactApi.Data;
using ReactApi.Dto;
using ReactApi.Entities;
using ReactApi.Service.Interface;

namespace ReactApi.Service.Implementation
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateAsync(UserDto request)
        {
            var user = new User
            {
                id = Guid.NewGuid(),
                Role_id = request.RoleId,
                Full_name = request.FullName,
                email = request.Email,
                Password_hash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Phone = request.Phone,
                Created_at = DateTime.UtcNow,
                Is_active = true
            };

            _context.users.Add(user);
            await _context.SaveChangesAsync();

            return user.id;
        }

        public async Task<IEnumerable<UserResponse>> GetAllAsync()
        {
            return await _context.users
                .Include(u => u.Role)
                .AsNoTracking()
                .Select(u => new UserResponse
                {
                    Id = u.id,
                    FullName = u.Full_name,
                    Email = u.email,
                    Role = u.Role.name
                })
                .ToListAsync();
        }

        public async Task<UserResponse?> GetByIdAsync(Guid id)
        {
            return await _context.users
                .Where(u => u.id == id)
                .Include(u => u.Role)
                .AsNoTracking()
                .Select(u => new UserResponse
                {
                    Id = u.id,
                    FullName = u.Full_name,
                    Email = u.email,
                    Role = u.Role.name
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateUserRequest request)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.id == id);
            if (user == null)
                return false;

            user.Role_id = request.RoleId;
            user.Full_name = request.FullName;
            user.email = request.Email;
            user.Phone = request.Phone;
            user.Is_active = request.IsActive;
            user.Updated_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }

}
