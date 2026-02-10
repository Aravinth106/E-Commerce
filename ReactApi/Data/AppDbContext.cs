using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ReactApi.Entities;

namespace ReactApi.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<category> categories { get; set; }

    public virtual DbSet<order> orders { get; set; }

    public virtual DbSet<order_item> order_items { get; set; }

    public virtual DbSet<product> products { get; set; }

    public virtual DbSet<role> roles { get; set; }

    public virtual DbSet<User> users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<category>(entity =>
        {
            entity.HasKey(e => e.id).HasName("categories_pkey");

            entity.HasIndex(e => e.name, "categories_name_key").IsUnique();

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamptz");
            entity.Property(e => e.name).HasMaxLength(100);

            entity.HasOne(d => d.parent).WithMany(p => p.Inverseparent)
                .HasForeignKey(d => d.parent_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_categories_parent");
        });

        modelBuilder.Entity<order>(entity =>
        {
            entity.HasKey(e => e.id).HasName("orders_pkey");

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamptz");
            entity.Property(e => e.order_date)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamptz");
            entity.Property(e => e.status).HasMaxLength(30);
            entity.Property(e => e.total_amount).HasPrecision(10, 2);

            entity.HasOne(d => d.user).WithMany(p => p.Orders)
                .HasForeignKey(d => d.user_id)
                .HasConstraintName("fk_orders_users");
        });

        modelBuilder.Entity<order_item>(entity =>
        {
            entity.HasKey(e => e.id).HasName("order_items_pkey");

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.price).HasPrecision(10, 2);

            entity.HasOne(d => d.order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.order_id)
                .HasConstraintName("fk_orderitems_orders");

            entity.HasOne(d => d.product).WithMany(p => p.order_items)
                .HasForeignKey(d => d.product_id)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_orderitems_products");
        });

        modelBuilder.Entity<product>(entity =>
        {
            entity.HasKey(e => e.id).HasName("products_pkey");

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamptz");
            entity.Property(e => e.is_active).HasDefaultValue(true);
            entity.Property(e => e.name).HasMaxLength(150);
            entity.Property(e => e.price).HasPrecision(10, 2);
            entity.Property(e => e.stock_quantity).HasDefaultValue(0);
            entity.Property(e => e.updated_at).HasColumnType("timestamptz");

            entity.HasOne(d => d.category).WithMany(p => p.products)
                .HasForeignKey(d => d.category_id)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_products_categories");
        });

        modelBuilder.Entity<role>(entity =>
        {
            entity.HasKey(e => e.id).HasName("roles_pkey");

            entity.HasIndex(e => e.name, "roles_name_key").IsUnique();

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.name).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.id).HasName("users_pkey");

            entity.HasIndex(e => e.email, "users_email_key").IsUnique();

            entity.Property(e => e.id)
                  .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.Created_at)
                  .HasColumnName("created_at")
                  .HasColumnType("timestamptz")
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.Updated_at)
                  .HasColumnName("updated_at")
                  .HasColumnType("timestamptz");

            entity.Property(e => e.Full_name)
                  .HasColumnName("full_name")
                  .HasMaxLength(100);

            entity.Property(e => e.Password_hash)
                  .HasColumnName("password_hash");

            entity.Property(e => e.Role_id)
                  .HasColumnName("role_id");

            entity.Property(e => e.Is_active)
                  .HasColumnName("is_active")
                  .HasDefaultValue(true);

            entity.Property(e => e.Phone)
                  .HasColumnName("phone")
                  .HasMaxLength(15);

            entity.HasOne(d => d.Role)
                  .WithMany(p => p.users)
                  .HasForeignKey(d => d.Role_id)
                  .OnDelete(DeleteBehavior.Restrict)
                  .HasConstraintName("fk_users_roles");
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
