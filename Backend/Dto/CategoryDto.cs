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
    public record CategoryDropdownDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
    }
    public record UpdateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
    }

}
