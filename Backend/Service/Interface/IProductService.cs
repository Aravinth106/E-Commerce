using ReactApi.Dto;

namespace ReactApi.Service.Interface
{
    public interface IProductService
    {
        Task<Guid> CreateAsync(CreateProductRequest request);
        Task<List<ProductResponse>> GetByCategoryAsync(Guid categoryId);
        Task<ProductResponse?> GetByIdAsync(Guid id);
        Task UpdateAsync(Guid id, UpdateProductRequest request);
        Task DeleteAsync(Guid id);
        Task<List<ProductResponse>> GetPagedAsync(int page, int pageSize);
        Task<PagedResult<ProductAdminResponse>> GetAdminPagedAsync(
            string? search,
            Guid? categoryId,
            bool? isActive,
            int page,
            int pageSize);
            }
}
