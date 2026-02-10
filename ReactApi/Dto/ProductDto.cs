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


}
