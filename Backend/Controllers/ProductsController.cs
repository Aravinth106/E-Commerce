using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Dto;
using ReactApi.Service.Implementation;
using ReactApi.Service.Interface;

namespace ReactApi.Controllers
{
    //[Authorize]
    //[ApiController]
    //[Route("api/products")]
    //public class ProductsController : ControllerBase
    //{
    //    private readonly IProductService _service;

    //    public ProductsController(IProductService service)
    //    {
    //        _service = service;
    //    }

    //    [Authorize(Roles = "Admin")]
    //    [HttpPost]
    //    public async Task<IActionResult> Create(CreateProductRequest request)
    //    {
    //        var id = await _service.CreateAsync(request);
    //        return Ok(id);
    //    }

    //    [HttpGet("by-category/{categoryId}")]
    //    public async Task<IActionResult> GetByCategory(Guid categoryId)
    //    {
    //        return Ok(await _service.GetByCategoryAsync(categoryId));
    //    }

    //    [HttpGet("by-id/{id}")]
    //    public async Task<IActionResult> GetById(Guid id)
    //    {
    //        return Ok(await _service.GetByIdAsync(id));
    //    }

    //    [HttpPut("{id:guid}")]
    //    [Authorize(Roles = "Admin")]
    //    public async Task<IActionResult> Update(Guid id, UpdateProductRequest request)
    //    {
    //        await _service.UpdateAsync(id, request);
    //        return NoContent();
    //    }

    //    [HttpDelete("{id:guid}")]
    //    [Authorize(Roles = "Admin")]
    //    public async Task<IActionResult> Delete(Guid id)
    //    {
    //        await _service.DeleteAsync(id);
    //        return NoContent();
    //    }

    //    [HttpGet]
    //    [AllowAnonymous]
    //    public async Task<IActionResult> GetPaged(
    //        [FromQuery] int page = 1,
    //        [FromQuery] int pageSize = 10)
    //    {
    //        var products = await _service.GetPagedAsync(page, pageSize);
    //        return Ok(products);
    //    }
    //}


    [Authorize]
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }

        // ================= ADMIN =================

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateProductRequest request)
        {
            var id = await _service.CreateAsync(request);
            return Ok(id);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, UpdateProductRequest request)
        {
            await _service.UpdateAsync(id, request);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        // Admin full list (with filters)
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminProducts(
            [FromQuery] string? search,
            [FromQuery] Guid? categoryId,
            [FromQuery] bool? isActive,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetAdminPagedAsync(
                search,
                categoryId,
                isActive,
                page,
                pageSize);

            return Ok(result);

        }

        // ================= PUBLIC =================

        [HttpGet("by-category/{categoryId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCategory(Guid categoryId)
        {
            return Ok(await _service.GetByCategoryAsync(categoryId));
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            return Ok(await _service.GetPagedAsync(page, pageSize));
        }
    }

}
