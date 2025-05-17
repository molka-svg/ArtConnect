const db = require('../config/db');

class Order {
  static async create(orderData) {
    const { user_id, user_cin, payment_method, total, address } = orderData;
    const query = `
      INSERT INTO orders (user_id, user_cin, payment_method, total, address, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    const [result] = await db.promise().query(query, [
      user_id,
      user_cin,
      payment_method,
      total,
      address || null,
    ]);
    return result.insertId;
  }

  static async createItems(orderId, items) {
    const query = `
      INSERT INTO order_items (order_id, artwork_id, price, quantity)
      VALUES ?
    `;
    const values = items.map(item => [orderId, item.id, item.prix, item.quantite]);
    await db.promise().query(query, [values]);
  }
}

module.exports = Order;