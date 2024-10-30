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
  const cartId = Number(req.params.id);

  if (!quantity) {
    return res.status(400).json({
      error: "Product ID and quantity are required",
      received: {
        quantity: quantity || "missing",
      },
    });
  }

  const newQuantity = Number(quantity);

  if (isNaN(newQuantity)) {
    return res.status(400).json({
      error: "Quantity must be a valid number",
      received: { quantity },
    });
  }

  try {
    // 1. Get current cart data to know the old quantity
    const currentCart = await new Promise<Cart>((resolve, reject) => {
      CartService.getCartById(cartId, (err: any, cart: Cart) => {
        if (err) reject(err);
        if (!cart) reject(new Error("Cart not found"));
        resolve(cart);
      });
    });

    // 2. Get product data to check stock
    const product = await new Promise<any>((resolve, reject) => {
      ProductService.getProductById(productId, (err: any, product: any) => {
        if (err) reject(err);
        if (!product) reject(new Error("Product not found"));
        resolve(product);
      });
    });

    // 3. Calculate stock changes
    const quantityDifference = newQuantity - currentCart.quantity;
    const newStock = product.stock - quantityDifference;

    // 4. Validate if we have enough stock
    if (newStock < 0) {
      return res.status(400).json({
        error: `Insufficient stock. Available: ${
          product.stock + currentCart.quantity
        }`,
      });
    }

    // 5. Update cart
    await new Promise<void>((resolve, reject) => {
      CartService.updateCart(
        cartId,
        { productId, quantity: newQuantity },
        (err: any) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    // 6. Update product stock
    await new Promise<void>((resolve, reject) => {
      ProductService.updateProduct(
        productId,
        { ...product, stock: newStock },
        (err: any) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    res.status(200).json({
      message: "Cart updated successfully",
      updatedStock: newStock,
      oldQuantity: currentCart.quantity,
      newQuantity: newQuantity,
    });
  } catch (error: any) {
    res.status(error.message.includes("not found") ? 404 : 500).json({
      error: error.message,
    });
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
