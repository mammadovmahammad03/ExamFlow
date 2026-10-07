using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamFlow.Infrastructure.Persistence.Configurations;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.ToTable("Students", t =>
            t.HasCheckConstraint("CK_Students_Grade", "[Grade] BETWEEN 1 AND 12"));

        builder.HasKey(s => s.Number);

        builder.Property(s => s.Number)
            .ValueGeneratedNever()
            .IsRequired();

        builder.Property(s => s.FirstName)
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(s => s.LastName)
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(s => s.Grade).IsRequired();

        builder.HasMany(s => s.Exams)
            .WithOne(e => e.Student!)
            .HasForeignKey(e => e.StudentNo)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
