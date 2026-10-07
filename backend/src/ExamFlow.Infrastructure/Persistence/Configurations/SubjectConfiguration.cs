using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamFlow.Infrastructure.Persistence.Configurations;

public class SubjectConfiguration : IEntityTypeConfiguration<Subject>
{
    public void Configure(EntityTypeBuilder<Subject> builder)
    {
        builder.ToTable("Subjects", t =>
            t.HasCheckConstraint("CK_Subjects_Grade", "[Grade] BETWEEN 1 AND 12"));

        builder.HasKey(s => s.Code);

        builder.Property(s => s.Code)
            .HasColumnType("char(3)")
            .IsFixedLength()
            .HasMaxLength(3)
            .IsRequired();

        builder.Property(s => s.Name)
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(s => s.Grade).IsRequired();

        builder.Property(s => s.TeacherFirstName)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(s => s.TeacherLastName)
            .HasMaxLength(20)
            .IsRequired();

        builder.HasMany(s => s.Exams)
            .WithOne(e => e.Subject!)
            .HasForeignKey(e => e.SubjectCode)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
