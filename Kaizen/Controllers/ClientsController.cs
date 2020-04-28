﻿using Kaizen.Domain.Entities;
using Kaizen.Domain.Repositories;
using Kaizen.EditModels;
using Kaizen.InputModels;
using Kaizen.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kaizen.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientsRepository _repository;
        private readonly IUnitWork _unitWork;

        public ClientsController(IClientsRepository clientsRepository, IUnitWork unitWork)
        {
            _repository = clientsRepository;
            _unitWork = unitWork;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientViewModel>>> GetClients()
        {
            return await _repository.GetAll().Select(c => new ClientViewModel(c)).ToListAsync();
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClientViewModel>> GetClient(string id)
        {
            Client client = await _repository.FindByIdAsync(id);

            if (client == null)
            {
                return NotFound();
            }

            return new ClientViewModel(client);
        }

        [HttpGet("[action]/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> CheckClientExists(string id)
        {
            return await _repository.GetAll().AnyAsync(c => c.Id == id);
        }

        // PUT: api/Clients/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(string id, ClientEditModel clientModel)
        {
            Client client = _repository.FindById(id);

            if (client is null)
            {
                return BadRequest();
            }

            client.FirstName = clientModel.FirstName;
            client.SecondName = clientModel.SecondName;
            client.LastName = clientModel.LastName;
            client.SecondLastName = clientModel.SecondLastName;
            client.ClientType = clientModel.ClientType;
            client.BusninessName = clientModel.BusninessName;
            client.TradeName = clientModel.TradeName;
            client.FirstPhoneNumber = clientModel.FirstPhoneNumber;
            client.SecondPhoneNumber = clientModel.SecondPhoneNumber;
            client.FirstLandLine = clientModel.FirstLandLine;
            client.SecondLandLine = clientModel.SecondLandLine;

            _repository.Update(client);

            try
            {
                await _unitWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Clients
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ClientViewModel>> PostClient(ClientInputModel clientInput)
        {
            ApplicationUser user = _unitWork.ApplicationUsers.FindById(clientInput.UserId);
            if (user is null)
            {
                return BadRequest();
            }

            Client client = new Client
            {
                Id = clientInput.Id,
                FirstName = clientInput.FirstName,
                SecondName = clientInput.SecondName,
                LastName = clientInput.LastName,
                SecondLastName = clientInput.SecondLastName,
                ClientType = clientInput.ClientType,
                NIT = clientInput.NIT,
                BusninessName = clientInput.BusninessName,
                TradeName = clientInput.TradeName,
                FirstPhoneNumber = clientInput.FirstPhoneNumber,
                SecondPhoneNumber = clientInput.SecondPhoneNumber,
                FirstLandLine = clientInput.FirstLandLine,
                SecondLandLine = clientInput.SecondLandLine,
                ClientAddress = new ClientAddress
                {
                    City = clientInput.ClientAddress.City,
                    Neighborhood = clientInput.ClientAddress.Neighborhood,
                    Street = clientInput.ClientAddress.Street,
                    ClientId = clientInput.Id
                },
                ContactPeople = clientInput.ContactPeople.Select(c => new ContactPerson
                {
                    Name = c.Name,
                    PhoneNumber = c.Phonenumber,
                    ClientId = clientInput.Id
                }).ToList(),
                User = user
            };

            _repository.Insert(client);

            try
            {
                await _unitWork.Save();
            }
            catch (DbUpdateException)
            {
                if (ClientExists(clientInput.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return new ClientViewModel(client);
        }

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ClientViewModel>> DeleteClient(string id)
        {
            Client client = await _repository.FindByIdAsync(id);
            return new ClientViewModel(client);
        }

        private bool ClientExists(string id)
        {
            return _repository.GetAll().Any(c => c.Id == id);
        }
    }
}
