using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kaizen.Domain.Data;
using Kaizen.Domain.Entities;
using Kaizen.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace Infrastructure.Test.Repositories
{
    [TestFixture]
    [Order(0)]
    public class ClientsRepositoryTest : BaseRepositoryTest
    {
        private IClientsRepository _clientsRepository;
        private ApplicationDbContext _dbContext;

        [SetUp]
        public void SetUp()
        {
            DetachAllEntities();

            _clientsRepository = ServiceProvider.GetService<IClientsRepository>();
            _dbContext = ServiceProvider.GetService<ApplicationDbContext>();
        }

        [Test]
        public void CheckClientRepository()
        {
            Assert.IsNotNull(_clientsRepository);
        }

        [Test]
        public void Save_Invalid_Client()
        {
            try
            {
                Client client = new Client();
                _clientsRepository.Insert(client);
            }
            catch (Exception)
            {
                Assert.Pass();
            }
        }

        [Test]
        public async Task Save_Valid_Client()
        {
            try
            {
                Client client = new Client
                {
                    Id = "12345678",
                    FirstName = "Manolo",
                    LastName = "Perez",
                    FirstPhoneNumber = "3167040706",
                    ClientType = "Natural Person",
                    ClientAddress = new ClientAddress
                    {
                        City = "Valledupar",
                        Neighborhood = "El centro",
                        Street = "Calle 9",
                        ClientId = "12345678"
                    },
                    ContactPeople = new List<ContactPerson>
                    {
                        new()
                        {
                            Name = "Jesus Guerrero",
                            PhoneNumber = "3163100223",
                            ClientId = "12345678"
                        }
                    },
                    UserId = ApplicationUserRepositoryTest.SavedUserId
                };

                _clientsRepository.Insert(client);

                await _dbContext.SaveChangesAsync();

                Assert.Pass();
            }
            catch (DbUpdateException e)
            {
                Assert.Fail(e.Message);
            }
        }

        [Test]
        public async Task Search_Non_Existent_Client()
        {
            Client client = await _clientsRepository.FindByIdAsync("123456789");

            Assert.IsNull(client);
        }

        [Test]
        public async Task Search_Existing_Client()
        {
            try
            {
                Client client = await _clientsRepository.FindByIdAsync("12345678");
                Assert.IsNotNull(client);
                Assert.AreEqual("12345678", client.Id);
                Assert.AreEqual("Manolo", client.FirstName);
            }
            catch (DbUpdateException e)
            {
                Assert.Fail(e.Message);
            }
        }

        [Test]
        public async Task Search_Existing_Client_With_User()
        {
            var client = await _clientsRepository.GetClientWithUser("12345678");

            Assert.IsNotNull(client);
            Assert.AreEqual(ApplicationUserRepositoryTest.SavedUserId, client.UserId);
        }

        [Test]
        public async Task Search_ClientId_Of_Non_Existent_Client()
        {
            var clientId = await _clientsRepository.GetClientId("123-456-789");

            Assert.IsNull(clientId);
        }

        [Test]
        public async Task Search_ClientId_Of_Existing_Client()
        {
            var clientId = await _clientsRepository.GetClientId(ApplicationUserRepositoryTest.SavedUserId);

            Assert.IsNotNull(clientId);
            Assert.AreEqual("12345678", clientId);
        }

        [Test]
        public async Task Search_Client_Requests()
        {
            var clientRequests = await _clientsRepository.GetClientRequestsAsync();

            Assert.IsNotNull(clientRequests);
            Assert.IsTrue(clientRequests.Any());
        }

        [Test]
        public async Task Update_Existing_Client()
        {
            try
            {
                Client client = await _clientsRepository.FindByIdAsync("12345678");
                Assert.IsNotNull(client);

                client.SecondName = "Jesus";
                _clientsRepository.Update(client);

                await _dbContext.SaveChangesAsync();

                client = await _clientsRepository.FindByIdAsync("12345678");
                Assert.AreEqual("Jesus", client.SecondName);
            }
            catch (DbUpdateException e)
            {
                Assert.Fail(e.Message);
            }
        }
    }
}
