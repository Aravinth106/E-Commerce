using System;
using System.Collections.Generic;

namespace ReactApi.Entities;

public partial class order
{
    public Guid id { get; set; }

    public Guid user_id { get; set; }

    public DateTime order_date { get; set; }

    public string status { get; set; } = null!;

    public decimal total_amount { get; set; }

    public DateTime created_at { get; set; }

    public virtual ICollection<order_item> OrderItems { get; set; } = new List<order_item>();

    public virtual User user { get; set; } = null!;
}
