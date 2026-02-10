using System;
using System.Collections.Generic;

namespace ReactApi.Entities;

public partial class category
{
    public Guid id { get; set; }

    public string name { get; set; } = null!;

    public Guid? parent_id { get; set; }

    public DateTime created_at { get; set; }

    public virtual ICollection<category> Inverseparent { get; set; } = new List<category>();

    public virtual category? parent { get; set; }

    public virtual ICollection<product> products { get; set; } = new List<product>();
}
