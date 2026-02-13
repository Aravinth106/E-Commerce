using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Dto;
using ReactApi.Service.Implementation;
using ReactApi.Service.Interface;

namespace ReactApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoriesController(ICategoryService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateCategoryRequest request)
        {
            var id = await _service.CreateAsync(request);
            return Ok(id);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        // GET: api/categories/parents
        [AllowAnonymous]
        [HttpGet("parents")]
        public async Task<IActionResult> GetParentCategories()
        {
            var result = await _service.GetParentCategoriesAsync();
            return Ok(result);
        }


        // GET: api/categories/{parentId}/children
        [AllowAnonymous]
        [HttpGet("{parentId:guid}/children")]
        public async Task<IActionResult> GetChildCategories(Guid parentId)
        {
            var result = await _service.GetChildCategoriesAsync(parentId);
            return Ok(result);
        }

        // GET: api/categories/{childCategoryId}/products
        [AllowAnonymous]
        [HttpGet("{childCategoryId:guid}/products")]
        public async Task<IActionResult> GetProductsByChildCategory(Guid childCategoryId)
        {
            var result = await _service.GetProductsByChildCategoryAsync(childCategoryId);
            return Ok(result);
        }
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var result = await _service.DeleteCategoryAsync(id);

            if (!result)
                return NotFound(new { message = "Category not found" });

            return NoContent(); // 204
        }
    }

}
