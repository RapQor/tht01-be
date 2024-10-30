import db from "../libs/db";
import { Cart } from "../types/cart";

class CartService {
  // Create
  static createCart(cart: Cart): Promise<{ id: number }> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO carts (product_id, quantity) VALUES (?, ?)`;
      const { productId, quantity } = cart;

      db.run(sql, [productId, quantity], function (this: any, err: any) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...cart });
      });
    });
  }

  static getCartWithProduct(id: number): Promise<Cart & { product: any }> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.*,
          p.name as product_name,
          p.description as product_description,
          p.price as product_price,
          p.category as product_category,
          p.stock as product_stock
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.id = ?
      `;

      db.get(sql, [id], (err: any, row: any) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static getAllCartsWithProducts(callback: (err: any, rows: Cart[]) => void) {
    const sql = `
      SELECT 
        c.*,
        p.name as product_name,
        p.description as product_description,
        p.price as product_price,
        p.category as product_category,
        p.stock as product_stock
      FROM carts c
      JOIN products p ON c.product_id = p.id
    `;

    db.all(sql, [], callback);
  }

  // Read
  static getAllCarts(callback: (err: any, rows: Cart[]) => void) {
    const sql = `SELECT * FROM carts`;
    db.all(sql, [], (err: any, rows: Cart[]) => {
      callback(err, rows);
    });
  }

  // Read
  static getCartById(id: number, callback: (err: any, row: Cart) => void) {
    const sql = `SELECT * FROM carts WHERE id = ?`;
    db.get(sql, [id], (err: any, row: Cart) => {
      callback(err, row);
    });
  }

  // Update
  static updateCart(
    id: number,
    updatedCart: Partial<Cart>,
    callback: (err: any) => void
  ) {
    const sql = `UPDATE carts SET quantity = ? WHERE id = ?`;
    const { quantity } = updatedCart;

    db.run(sql, [quantity, id], callback);
  }

  // Delete
  static deleteCart(id: number, callback: (err: any) => void) {
    const sql = `DELETE FROM carts WHERE id = ?`;
    db.run(sql, [id], callback);
  }

  // Filter by productId
  static getCartsByProductId(
    productId: number,
    callback: (err: any, rows: Cart[]) => void
  ) {
    const sql = `SELECT * FROM carts WHERE product_id = ?`;
    db.all(sql, [productId], (err: any, rows: Cart[]) => {
      callback(err, rows);
    });
  }
}

export default CartService;
