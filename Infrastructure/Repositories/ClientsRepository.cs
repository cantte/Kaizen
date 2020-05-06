using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kaizen.Domain.Data;
using Kaizen.Domain.Entities;
using Kaizen.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Kaizen.Infrastructure.Repositories
{
    public class ClientsRepository : RepositoryBase<Client, string>, IClientsRepository
    {
        public ClientsRepository(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {

        }

        public async Task<ClientAddress> GetClientAddressAsync(string clientId)
        {
            return await ApplicationDbContext.ClientAddresses.Where(c => c.ClientId == clientId).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ContactPerson>> GetClientContactPeopleAsync(string clientId)
        {
            return await ApplicationDbContext.ContactPeople.Where(p => p.ClientId == clientId).ToListAsync();
        }

        public void UpdateClientAddress(ClientAddress clientAddress)
        {
            ApplicationDbContext.Entry(clientAddress).State = EntityState.Modified;
        }
    }
}