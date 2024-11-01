import db from "../libs/db";
import { Product } from "../types/product";

class ProductService {
  // CREATE
  static createProduct(product: Product): Promise<{ id: number }> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)`;
      const { name, description, price, category, stock } = product;

      db.run(
        sql,
        [name, description, price, category, stock],
        function (this: any, err: any) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...product });
        }
      );
    });
  }

  // READ
  static getAllProducts(callback: (err: any, rows: Product[]) => void) {
    const sql = `SELECT * FROM products`;
    db.all(sql, [], (err: any, rows: Product[]) => {
      callback(err, rows);
    });
  }

  // READ
  static getProductById(
    id: number,
    callback: (err: any, row: Product) => void
  ) {
    const sql = `SELECT * FROM products WHERE id = ?`;
    db.get(sql, [id], (err: any, row: Product) => {
      callback(err, row);
    });
  }

  // UPDATE
  static updateProduct(
    id: number,
    updatedProduct: Product,
    callback: (err: any) => void
  ) {
    const sql = `
      UPDATE products SET 
        name = ?, 
        description = ?, 
        price = ?, 
        category = ?, 
        stock = ? 
      WHERE id = ?`;
    const { name, description, price, category, stock } = updatedProduct;

    db.run(sql, [name, description, price, category, stock, id], callback);
  }

  // Filter by category
  static getProductsByCategory(
    category: string,
    callback: (err: any, rows: Product[]) => void
  ) {
    const sql = `SELECT * FROM products WHERE category = ?`;
    db.all(sql, [category], (err: any, rows: Product[]) => {
      callback(err, rows);
    });
  }

  // DELETE
  static deleteProduct(id: number, callback: (err: any) => void) {
    const sql = `DELETE FROM products WHERE id = ?`;
    db.run(sql, [id], callback);
  }
}

export default ProductService;
