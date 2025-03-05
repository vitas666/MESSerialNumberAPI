using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MesSerialNumber.Services
{
    public interface IDbRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        void Add(T entity);
        void Update(T entity);
        //void Delete(int id);
        void SaveChanges();
    }

    public interface IDataService<T> where T : class
    {
        IQueryable<T> GetEntities();
        void AddEntity(T entity);
        void UpdateEntity(T entity);
        //void DeleteEntity(int id);
    }
}
