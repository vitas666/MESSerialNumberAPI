using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using MESSerialNumberAPI.Constant;
using static MESSerialNumberAPI.Services.DatabaseConn;

namespace MESSerialNumberAPI.Services
{
    public class DatabaseConn
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
                _context.Entry(entity).State = EntityState.Added;
            }
            public void AddRange(IEnumerable<T> entities, int batchSize)
            {
                var entityList = entities.ToList();
                for (int i = 0; i < entityList.Count; i += batchSize)
                {
                    var batch = entityList.Skip(i).Take(batchSize).ToList();

                    _context.Set<T>().AddRange(batch); // Add the batch to the DbContext
                }
            }

            public void Update(T entity)
            {
                _context.Entry(entity).State = EntityState.Modified;
            }

            public void UpdateRange(IEnumerable<T> entities, int batchSize)
            {
                var entityList = entities.ToList();
                for (int i = 0; i < entityList.Count; i += batchSize)
                {
                    var batch = entityList.Skip(i).Take(batchSize).ToList();

                    foreach (var entity in batch)
                    {
                        _context.Entry(entity).State = EntityState.Modified;
                    }
                }
            }

            public void Delete(int id)
            {
                var entity = _context.Set<T>().Find(id);
                if (entity != null)
                {
                    _context.Set<T>().Remove(entity);
                }
            }

            public void SaveChanges()
            {
                // commit after save changes
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
            public void UpdateEntity<T>(T entity) where T : class
            {
                var repository = new GenericRepository<T>(_context);
                repository.Update(entity);
            }
            public void UpdateEntities<T>(IEnumerable<T> entities, int batchSize) where T : class
            {
                var repository = new GenericRepository<T>(_context);
                repository.UpdateRange(entities, batchSize);
            }
            public void AddEntity<T>(T entity) where T : class
            {
                var repository = new GenericRepository<T>(_context);
                repository.Add(entity);
            }
            public void AddEntities<T>(IEnumerable<T> entities, int batchSize) where T : class
            {
                var repository = new GenericRepository<T>(_context);
                repository.AddRange(entities, batchSize);
            }
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
                public DbSet<Models.MESSNDB.SerialData> SerialData { get; set; }
                public DbSet<Models.MESSNDB.PartMast> PartMast { get; set; }
                public DbSet<Models.MESSNDB.SctlMast> SctlMast { get; set; }
                public DbSet<Models.MESSNDB.SerialHist> SerialHist { get; set; }
                public DbSet<Models.MESSNDB.CodeMast> CodeMast { get; set; }
                public DbSet<Models.MESSNDB.PartCoding> PartCoding { get; set; }
                public DbSet<Models.MESSNDB.vPartMast> vPartMast { get; set; }
                public DbSet<Models.MESSNDB.vSerialData> vSerialData { get; set; }
                public DbSet<Models.MESSNDB.vPartCoding> vPartCoding { get; set; }
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
                public DbSet<Models.CiMESDB.IF_WO_BOM> iF_WO_BOM { get; set; }
                public DbSet<Models.CiMESDB.vSerialCustPartNo> vSerialCustPartNo { get; set; }
            }
            public CIMESDBDataService() : base(new CIMESDBContext(connectionName)) { }
        }
    }
}