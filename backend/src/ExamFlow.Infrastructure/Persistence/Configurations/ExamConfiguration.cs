using ExamFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamFlow.Infrastructure.Persistence.Configurations;

public class ExamConfiguration : IEntityTypeConfiguration<Exam>
{
    public void Configure(EntityTypeBuilder<Exam> builder)
    {
        builder.ToTable("Exams", t =>
            t.HasCheckConstraint("CK_Exams_Grade", "[Grade] BETWEEN 2 AND 5"));

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).ValueGeneratedOnAdd();

        builder.Property(e => e.SubjectCode)
            .HasColumnType("char(3)")
            .IsFixedLength()
            .HasMaxLength(3)
            .IsRequired();

        builder.Property(e => e.StudentNo).IsRequired();

        builder.Property(e => e.ExamDate)
            .HasColumnType("date")
            .IsRequired();

        builder.Property(e => e.Grade).IsRequired();

        builder.HasIndex(e => new { e.SubjectCode, e.StudentNo, e.ExamDate })
            .IsUnique()
            .HasDatabaseName("UX_Exams_Subject_Student_Date");

        builder.HasIndex(e => e.SubjectCode).HasDatabaseName("IX_Exams_SubjectCode");
        builder.HasIndex(e => e.StudentNo).HasDatabaseName("IX_Exams_StudentNo");
    }
}
