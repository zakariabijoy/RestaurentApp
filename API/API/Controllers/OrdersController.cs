using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly RestaurantDBContext _context;

        public OrdersController(RestaurantDBContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<Object> GetOrders()
        {
            return await _context.Orders.Join(_context.Customers, o =>o.CustomerId,c=>c.CustomerId,(o,c)=> new {o.OrderrId,o.OrderNo,Customer=c.Name,o.Pmethod,o.Gtotal }).ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<object> GetOrder(long id)
        {
            var order = await _context.Orders.FindAsync(id);
            order.DeletedOrderItemsIds = "";

            var orderDetails =await _context.OrderItems.Where(o => o.OrderId == id).Join(_context.Items, o => o.ItemId, i => i.ItemId, (o, i) => new { o.OrderId, o.OrderItemId, o.ItemId, ItemName= i.Name, i.Price , o.Quantity, Total = o.Quantity * i.Price}).ToListAsync();

            return Ok(new { order, orderDetails });

        }

        

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            try
            {
                //order table
                if(order.OrderrId == 0)
                {
                    _context.Orders.Add(order);
                }
                else
                {
                    _context.Entry(order).State = EntityState.Modified;
                }

                //orderitems table
                foreach (var item in order.OrderItems)
                {
                    if (item.OrderItemId == 0)
                    {
                        _context.OrderItems.Add(item);
                    }
                    else
                    {
                        _context.Entry(item).State = EntityState.Modified;
                    }
                   
                }

                //delete for order items
                foreach (var id in order.DeletedOrderItemsIds.Split(",").Where(x => x!=""))
                {
                    OrderItem x = _context.OrderItems.Find(Convert.ToInt64(id));
                    _context.OrderItems.Remove(x);
                }
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(long id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(long id)
        {
            return _context.Orders.Any(e => e.OrderrId == id);
        }
    }
}
