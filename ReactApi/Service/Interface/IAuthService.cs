using ReactApi.Dto;

namespace ReactApi.Service.Interface
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);

    }
}
