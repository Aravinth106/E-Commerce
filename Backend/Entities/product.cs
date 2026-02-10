using System;
using System.Collections.Generic;

namespace ReactApi.Entities;

public partial class product
{
    public Guid id { get; set; }

    public Guid category_id { get; set; }

    public string name { get; set; } = null!;

    public string? description { get; set; }

    public decimal price { get; set; }

    public int stock_quantity { get; set; }

    public bool? is_active { get; set; }

    public DateTime created_at { get; set; }

    public DateTime? updated_at { get; set; }

    public virtual category category { get; set; } = null!;

    public virtual ICollection<order_item> order_items { get; set; } = new List<order_item>();
}
