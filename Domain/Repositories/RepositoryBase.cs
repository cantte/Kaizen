using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Kaizen.Core.Domain;
using Kaizen.Domain.Data;

namespace Kaizen.Domain.Repositories
{
    public abstract class RepositoryBase<T, TKey> : IRepositoryBase<T, TKey> where T : class
    {
        protected ApplicationDbContext ApplicationDbContext { get; }

        protected RepositoryBase(ApplicationDbContext applicationDbContext)
        {
            ApplicationDbContext = applicationDbContext;
        }

        public virtual IQueryable<T> GetAll()
        {
            return ApplicationDbContext.Set<T>().AsNoTracking();
        }

        public virtual IQueryable<T> Where(Expression<Func<T, bool>> expression)
        {
            return ApplicationDbContext.Set<T>().Where(expression);
        }

        public virtual void Insert(T entity)
        {
            ApplicationDbContext.Set<T>().Add(entity);
        }

        public virtual void Update(T entity)
        {
            ApplicationDbContext.Set<T>().Update(entity);
        }

        public virtual async Task<T> FindByIdAsync(TKey id)
        {
            return await ApplicationDbContext.Set<T>().FindAsync(id);
        }

        public void Delete(T entity)
        {
            ApplicationDbContext.Set<T>().Remove(entity);
        }
    }
}
