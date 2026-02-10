using System;
using System.Collections.Generic;

namespace ReactApi.Entities;

public partial class User
{
    public Guid id { get; set; }

    public Guid Role_id { get; set; }

    public string Full_name { get; set; } = null!;

    public string email { get; set; } = null!;

    public string Password_hash { get; set; } = null!;

    public string? Phone { get; set; }

    public bool? Is_active { get; set; }

    public DateTime Created_at { get; set; }

    public DateTime? Updated_at { get; set; }

    public virtual ICollection<order> Orders { get; set; } = new List<order>();

    public virtual role Role { get; set; } = null!;
}
