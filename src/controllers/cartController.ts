import { Request, Response } from "express";
import { Cart } from "../types/cart";
import CartService from "../services/cartService";
import ProductService from "../services/productService";

// cartController.ts
export const createCartController = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      error: "Product ID and quantity are required",
      received: {
        productId: productId || "missing",
        quantity: quantity || "missing",
      },
    });
  }

  const cartData = {
    productId: Number(productId),
    quantity: Number(quantity),
  };

  if (isNaN(cartData.productId) || isNaN(cartData.quantity)) {
    return res.status(400).json({
      error: "Product ID and quantity must be valid numbers",
      received: {
        productId,
        quantity,
      },
    });
  }

  try {
    // Check if product exists and has enough stock
    await new Promise((resolve, reject) => {
      ProductService.getProductById(
        cartData.productId,
        (err: any, product: any) => {
          if (err) reject(err);
          if (!product) reject(new Error("Product not found"));
          if (product.stock < cartData.quantity) {
            reject(
              new Error(`Insufficient stock. Available: ${product.stock}`)
            );
          }
          resolve(product);
        }
      );
    });

    const cart = await CartService.createCart(cartData);

    // Update product stock
    await new Promise((resolve, reject) => {
      ProductService.getProductById(
        cartData.productId,
        (err: any, product: any) => {
          if (err) reject(err);

          const updatedStock = product.stock - cartData.quantity;
          ProductService.updateProduct(
            cartData.productId,
            { ...product, stock: updatedStock },
            (err: any) => {
              if (err) reject(err);
              resolve(true);
            }
          );
        }
      );
    });

    res.status(201).json(cart);
  } catch (error: any) {
    res.status(error.message.includes("not found") ? 404 : 400).json({
      error: error.message,
    });
  }
};

export const getAllCartController = async (req: Request, res: Response) => {
  try {
    const product_id = req.query.product_id as string;

    if (product_id) {
      CartService.getCartsByProductId(
        Number(product_id),
        (err: any, rows: Cart[]) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json(rows);
        }
      );
    } else {
      CartService.getAllCartsWithProducts((err: any, rows: Cart[]) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartByIdController = async (req: Request, res: Response) => {
  try {
    CartService.getCartById(Number(req.params.id), (err: any, rows: Cart) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(rows);
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartController = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  const cartData = {
    productId: Number(productId),
    quantity: Number(quantity),
  };

  try {
    CartService.updateCart(Number(req.params.id), cartData, (err: any) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Cart updated successfully" });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartController = async (req: Request, res: Response) => {
  try {
    CartService.deleteCart(Number(req.params.id), (err: any) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Cart deleted successfully" });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
