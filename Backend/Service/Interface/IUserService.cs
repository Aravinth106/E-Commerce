using ReactApi.Dto;

namespace ReactApi.Service.Interface
{
    public interface IUserService
    {
        Task<Guid> CreateAsync(UserDto request);
        Task<IEnumerable<UserResponse>> GetAllAsync();
        Task<UserResponse?> GetByIdAsync(Guid id);
        Task<bool> UpdateAsync(Guid id, UpdateUserRequest request);

    }

}
