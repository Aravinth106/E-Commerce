namespace ReactApi.Dto
{
    public record CreateProductRequest(
        Guid CategoryId,
        string Name,
        string? Description,
        decimal Price,
        int StockQuantity
    );

    public record ProductResponse(
        Guid Id,
        string Name,
        decimal Price,
        int StockQuantity,
        bool IsActive
    );

    public record UpdateProductRequest(
        string Name,
        string? Description,
        decimal Price,
        int StockQuantity,
        bool IsActive
    );
    public class ProductDropdownDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
    }

    public record PagedResult<T>(
        List<T> Items,
        int TotalCount,
        int Page,
        int PageSize
    );
    public record ProductAdminResponse(
        Guid Id,
        string Name,
        string Description,
        decimal Price,
        int StockQuantity,
        string CategoryName,
        bool IsActive
    );


}
