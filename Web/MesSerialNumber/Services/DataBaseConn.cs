using MesSerialNumber.Constant;
using MesSerialNumber.Models;
using System;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

namespace MesSerialNumber.Services
{
    public class DataBaseConn
    {
        public class GenericDbContext : DbContext
        {
            public GenericDbContext(string connectionStringName) : base($"name={connectionStringName}") { }
        }

        public class GenericRepository<T> : IDbRepository<T> where T : class
        {
            private readonly GenericDbContext _context;
            public GenericRepository(GenericDbContext context)
            {
                _context = context;
            }
            public IQueryable<T> GetAll()
            {
                return _context.Set<T>();
            }
            public void Add(T entity)
            {
                _context.Set<T>().Add(entity);
            }
            public void Update(T entity)
            {
                _context.Entry(entity).State = EntityState.Modified;
            }
            //public void Delete(int id)
            //{
            //    var entity = _context.Set<T>().Find(id);
            //    if (entity != null)
            //    {
            //        _context.Set<T>().Remove(entity);
            //    }
            //}
            public void SaveChanges()
            {
                _context.SaveChanges();
            }
        }

        public class BaseDataService : IDisposable
        {
            protected readonly GenericDbContext _context;
            public BaseDataService(GenericDbContext context)
            {
                _context = context;
            }
            public void Dispose()
            {
                _context?.Dispose();
            }
            public IQueryable<T> GetEntities<T>() where T : class
            {
                var repository = new GenericRepository<T>(_context);
                return repository.GetAll();
            }
            public void AddEntity<T>(T entity) where T : class
            {
                var repository = new GenericRepository<T>(_context);
                repository.Add(entity);
            }
            public void UpdateEntity<T>(T entity) where T : class
            {
                var repository = new GenericRepository<T>(_context);
                repository.Update(entity);
            }
            //public void DeleteEntity<T>(int id) where T : class
            //{
            //    var repository = new GenericRepository<T>(_context);
            //    repository.Delete(id);
            //}
            public void SaveChanges()
            {
                _context.SaveChanges();
            }
        }

        public class MESDBDataService : BaseDataService
        {
            private static readonly string connectionName = Common.MESSNDB;
            public MESDBContext Context => (MESDBContext)_context;
            public class MESDBContext : GenericDbContext
            {
                public MESDBContext(string connectionStringName) : base(connectionStringName) { }
                public DbSet<Models.MESSNDB.PartMast> PartMast { get; set; }
                public DbSet<Models.MESSNDB.SctlMast> SctlMast { get; set; }
                public DbSet<Models.MESSNDB.PartCoding> PartCoding { get; set; }
            }
            public MESDBDataService() : base(new MESDBContext(connectionName)) { }
        }

        public class CIMESDBDataService : BaseDataService
        {
            private static readonly string connectionName = Common.CIMESDB;
            public CIMESDBContext Context => (CIMESDBContext)_context;
            public class CIMESDBContext : GenericDbContext
            {
                public CIMESDBContext(string connectionStringName) : base(connectionStringName) { }
                public DbSet<Models.CiMESDB.MES_MMS_MAT> MesMmsMat { get; set; }
            }            
            public CIMESDBDataService() : base(new CIMESDBContext(connectionName)) { }
        }
    }
}

//public class GenericDbContext<T> : DbContext where T : class
//{
//    public DbSet<T> Entities { get; set; }
//    public GenericDbContext(string connectionStringName) : base($"name={connectionStringName}") { }
//}

//public class GenericRepository<T> : IDbRepository<T> where T : class
//{
//    private readonly GenericDbContext<T> _context;
//    public GenericRepository(GenericDbContext<T> context)
//    {
//        _context = context;
//    }
//    public IQueryable<T> GetAll()
//    {
//        return _context.Set<T>();
//    }
//}

//public class DataService<T> : IDataService<T>, IDisposable where T : class
//{
//    private bool _disposed = false;
//    private readonly GenericDbContext<T> _context;
//    private readonly IDbRepository<T> _repository;
//    public DataService(string connectionStringName)
//    {
//        _context = new GenericDbContext<T>(connectionStringName);
//        _repository = new GenericRepository<T>(_context);
//    }

//    ~DataService()
//    {
//        Dispose(false);
//    }

//    public void Dispose()
//    {
//        Dispose(true);
//        GC.SuppressFinalize(this);
//    }

//    protected virtual void Dispose(bool disposing)
//    {
//        if (!_disposed)
//        {
//            if (disposing)
//            {
//                _context?.Dispose();
//            }
//            _disposed = true;
//        }
//    }

//    public IQueryable<T> GetEntities()
//    {
//        return _repository.GetAll();
//    }
//}