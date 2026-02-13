using Microsoft.EntityFrameworkCore;
using ReactApi.Data;
using ReactApi.Dto;
using ReactApi.Entities;
using ReactApi.Service.Interface;

namespace ReactApi.Service.Implementation
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateAsync(CreateCategoryRequest request)
        {
            // Validate parent category
            if (request.ParentId.HasValue)
            {
                var parentExists = await _context.categories
                    .AnyAsync(c => c.id == request.ParentId);

                if (!parentExists)
                    throw new Exception("Parent category does not exist");
            }

            var category = new category
            {
                id = Guid.NewGuid(),
                name = request.Name,
                parent_id = request.ParentId,
                created_at = DateTime.UtcNow
            };

            _context.categories.Add(category);
            await _context.SaveChangesAsync();

            return category.id;
        }

        public async Task<List<CategoryResponse>> GetAllAsync()
        {
            return await _context.categories
                .Select(c => new CategoryResponse(
                    c.id,
                    c.name,
                    c.parent_id
                ))
                .ToListAsync();
        }

        public async Task<List<CategoryDropdownDto>> GetParentCategoriesAsync()
        {
            return await _context.categories
                .Where(c => c.parent_id == null)
                .OrderBy(c => c.name)
                .Select(c => new CategoryDropdownDto
                {
                    Id = c.id,
                    Name = c.name
                })
                .ToListAsync();
        }

        // 2️⃣ Get Child Categories by Parent
        public async Task<List<CategoryDropdownDto>> GetChildCategoriesAsync(Guid parentId)
        {
            // Validate parent exists
            var parentExists = await _context.categories
                .AnyAsync(c => c.id == parentId && c.parent_id == null);

            if (!parentExists)
                throw new Exception("Invalid parent category");

            return await _context.categories
                .Where(c => c.parent_id == parentId)
                .OrderBy(c => c.name)
                .Select(c => new CategoryDropdownDto
                {
                    Id = c.id,
                    Name = c.name
                })
                .ToListAsync();
        }

        // 3️⃣ Get Products by CHILD Category
        public async Task<List<ProductDropdownDto>> GetProductsByChildCategoryAsync(Guid childCategoryId)
        {
            // Validate child category
            var isChildCategory = await _context.categories
                .AnyAsync(c => c.id == childCategoryId && c.parent_id != null);

            if (!isChildCategory)
                throw new Exception("Products can be fetched only for child categories");

            return await _context.products
                .Where(p =>
                    p.category_id == childCategoryId &&
                    p.is_active == true &&
                    p.stock_quantity > 0
                )
                .OrderBy(p => p.name)
                .Select(p => new ProductDropdownDto
                {
                    Id = p.id,
                    Name = p.name,
                    Price = p.price
                })
                .ToListAsync();
        }

        public async Task<bool> DeleteCategoryAsync(Guid id)
        {
            var category = await _context.categories
                .FirstOrDefaultAsync(c => c.id == id);

            if (category == null)
                return false;

            _context.categories.Remove(category);
            await _context.SaveChangesAsync();

            return true;
        }

    }

}
