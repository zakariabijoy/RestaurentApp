using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace API.Models
{
    public partial class Order
    {
        public Order()
        {
            OrderItems = new HashSet<OrderItem>();
        }

        public long OrderrId { get; set; }
        public string OrderNo { get; set; }
        public int? CustomerId { get; set; }
        public string Pmethod { get; set; }
        public decimal? Gtotal { get; set; }

        [NotMapped]
        public string DeletedOrderItemsIds { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}
