using ReactApi.Dto;

namespace ReactApi.Service.Interface
{
    public interface ICategoryService
    {
        Task<Guid> CreateAsync(CreateCategoryRequest request);
        Task<List<CategoryResponse>> GetAllAsync();
        Task<List<CategoryDropdownDto>> GetParentCategoriesAsync();
        Task<List<CategoryDropdownDto>> GetChildCategoriesAsync(Guid parentId);
        Task<List<ProductDropdownDto>> GetProductsByChildCategoryAsync(Guid childCategoryId);
    }

}
