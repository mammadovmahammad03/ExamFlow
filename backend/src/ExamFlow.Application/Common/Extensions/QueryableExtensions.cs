using System.Linq.Expressions;
using ExamFlow.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Application.Common.Extensions;

public static class QueryableExtensions
{
    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
        this IQueryable<T> query, int page, int pageSize, CancellationToken ct = default)
    {
        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<T>(items, total, page, pageSize);
    }

    public static IQueryable<T> OrderByDynamic<T>(
        this IQueryable<T> query,
        string? sortBy,
        bool descending,
        IReadOnlyDictionary<string, Expression<Func<T, object>>> map,
        Expression<Func<T, object>> fallback)
    {
        Expression<Func<T, object>> selector = fallback;
        if (!string.IsNullOrWhiteSpace(sortBy) && map.TryGetValue(sortBy.ToLowerInvariant(), out var found))
            selector = found;

        return descending ? query.OrderByDescending(selector) : query.OrderBy(selector);
    }
}
