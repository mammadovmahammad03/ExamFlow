using System.Linq.Expressions;

namespace ExamFlow.Application.Interfaces.Persistence;

public interface IGenericRepository<T> where T : class
{
    IQueryable<T> Query();
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<int> CountAsync(CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
}
