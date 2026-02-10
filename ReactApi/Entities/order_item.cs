using System;
using System.Collections.Generic;

namespace ReactApi.Entities;

public partial class order_item
{
    public Guid id { get; set; }

    public Guid order_id { get; set; }

    public Guid product_id { get; set; }

    public int quantity { get; set; }

    public decimal price { get; set; }

    public virtual order order { get; set; } = null!;

    public virtual product product { get; set; } = null!;
}
