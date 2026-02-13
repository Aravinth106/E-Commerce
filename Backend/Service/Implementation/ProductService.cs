using Microsoft.EntityFrameworkCore;
using ReactApi.Data;
using ReactApi.Dto;
using ReactApi.Entities;
using ReactApi.Service.Interface;

namespace ReactApi.Service.Implementation
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateAsync(CreateProductRequest request)
        {
            var categoryExists = await _context.categories
                .AnyAsync(c => c.id == request.CategoryId);

            if (!categoryExists)
                throw new Exception("Category does not exist");

            var product = new product
            {
                id = Guid.NewGuid(),
                category_id = request.CategoryId,
                name = request.Name,
                description = request.Description,
                price = request.Price,
                stock_quantity = request.StockQuantity,
                is_active = true,
                created_at = DateTime.UtcNow
            };

            _context.products.Add(product);
            await _context.SaveChangesAsync();

            return product.id;
        }

        public async Task<List<ProductResponse>> GetByCategoryAsync(Guid categoryId)
        {
            return await _context.products
                .Where(p => p.category_id == categoryId && p.is_active == true)
                .Select(p => new ProductResponse(
                    p.id,
                    p.name,
                    p.price,
                    p.stock_quantity,
                    p.is_active ?? false
                ))
                .ToListAsync();
        }

        public async Task<ProductResponse?> GetByIdAsync(Guid id)
        {
            return await _context.products
                .Where(p => p.id == id && p.is_active == true)
                .Select(p => new ProductResponse(
                    p.id,
                    p.name,
                    p.price,
                    p.stock_quantity,
                    p.is_active ?? false
                ))
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(Guid id, UpdateProductRequest request)
        {
            var product = await _context.products.FindAsync(id);

            if (product == null)
                throw new Exception("Product not found");

            product.name = request.Name;
            product.description = request.Description;
            product.price = request.Price;
            product.stock_quantity = request.StockQuantity;
            product.is_active = request.IsActive;
            product.updated_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var product = await _context.products.FindAsync(id);

            if (product == null)
                throw new Exception("Product not found");

            product.is_active = false;
            product.updated_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task<List<ProductResponse>> GetPagedAsync(
            int page,
            int pageSize
        )
        {
            return await _context.products
                .Where(p => p.is_active == true)
                .OrderBy(p => p.name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductResponse(
                    p.id,
                    p.name,
                    p.price,
                    p.stock_quantity,
                    p.is_active ?? false
                ))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<PagedResult<ProductAdminResponse>> GetAdminPagedAsync(
            string? search,
            Guid? categoryId,
            bool? isActive,
            int page,
            int pageSize)
        {
            var query = _context.products
                .Include(p => p.category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.name.Contains(search));

            if (categoryId.HasValue)
                query = query.Where(p => p.category_id == categoryId);

            if (isActive.HasValue)
                query = query.Where(p => p.is_active == isActive);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(p => p.name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductAdminResponse(
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.stock_quantity,
                    p.category.name,
                    p.is_active ?? false
                ))
                .AsNoTracking()
                .ToListAsync();

            return new PagedResult<ProductAdminResponse>(
                items,
                totalCount,
                page,
                pageSize
            );
        }


    }

}
