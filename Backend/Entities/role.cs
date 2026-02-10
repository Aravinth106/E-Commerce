using System;
using System.Collections.Generic;

namespace ReactApi.Entities;

public partial class role
{
    public Guid id { get; set; }

    public string name { get; set; } = null!;
    public string? description { get; set; }

    public DateTime created_at { get; set; }

    public virtual ICollection<User> users { get; set; } = new List<User>();
}
