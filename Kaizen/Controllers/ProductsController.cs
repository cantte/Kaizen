using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Kaizen.Domain.Entities;
using Kaizen.Domain.Repositories;
using Kaizen.Models.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kaizen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsRepository _productsRepository;
        private readonly IUnitWork _unitWork;
        private readonly IMapper _mapper;

        public ProductsController(IProductsRepository productsRepository, IUnitWork unitWork, IMapper mapper)
        {
            _productsRepository = productsRepository;
            _unitWork = unitWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductViewModel>>> GetProducts()
        {
            List<Product> products = await _productsRepository.GetAll().ToListAsync();
            return Ok(_mapper.Map<IEnumerable<ProductViewModel>>(products));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductViewModel>> GetProduct(string id)
        {
            Product product = await _productsRepository.FindByIdAsync(id);
            if (product == null)
            {
                return NotFound($"El producto identificado con el código {id} no está registrado.");
            }

            return _mapper.Map<ProductViewModel>(product);
        }

        [HttpGet("[action]/{id}")]
        [AllowAnonymous]
        public async Task<bool> CheckExists(string id)
        {
            return await _productsRepository.GetAll().AnyAsync(p => p.Code == id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductViewModel>> PutProduct(string id, ProductEditModel productModel)
        {
            Product product = await _productsRepository.FindByIdAsync(id);
            if (product is null)
            {
                return BadRequest($"El producto identificado con el código {id} no está registrado.");
            }

            _mapper.Map(productModel, product);
            _productsRepository.Update(product);

            try
            {
                await _unitWork.SaveAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound($"Error de actualización. El producto identificado con el código {id} no está registrado.");
                }

                throw;
            }

            return _mapper.Map<ProductViewModel>(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductViewModel>> PostProduct(ProductInputModel productModel)
        {
            Product product = _mapper.Map<Product>(productModel);
            _productsRepository.Insert(product);

            try
            {
                await _unitWork.SaveAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductExists(product.Code))
                {
                    return Conflict($"Ya existe un producto registrado con el código { productModel.Code }.");
                }

                throw;
            }

            return _mapper.Map<ProductViewModel>(product);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ProductViewModel>> DeleteProduct(string id)
        {
            Product product = await _productsRepository.FindByIdAsync(id);
            if (product == null)
            {
                return NotFound($"El producto identificado con el código {id} no está registrado.");
            }

            return _mapper.Map<ProductViewModel>(product);
        }

        private bool ProductExists(string id)
        {
            return _productsRepository.GetAll().Any(e => e.Code == id);
        }
    }
}
