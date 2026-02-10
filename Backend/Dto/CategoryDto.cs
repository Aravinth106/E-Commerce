namespace ReactApi.Dto
{
   public record CreateCategoryRequest(
    string Name,
    Guid? ParentId
);

public record CategoryResponse(
    Guid Id,
    string Name,
    Guid? ParentId
);
    public class CategoryDropdownDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
    }
    public class ProductDropdownDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
    }

}
