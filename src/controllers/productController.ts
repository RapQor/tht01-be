import { Request, Response } from "express";
import { Product } from "../types/product";
import ProductService from "../services/productService";

export const createProductController = async (req: Request, res: Response) => {
  const { name, description, price, category, stock } = req.body;

  // Convert price and stock to numbers since form-data sends everything as strings
  const productData = {
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
  };

  // Validation check
  if (!name || !description || !price || !category || !stock) {
    return res.status(400).json({
      error: "All fields are required.",
      received: {
        name: name || "missing",
        description: description || "missing",
        price: price || "missing",
        category: category || "missing",
        stock: stock || "missing",
      },
    });
  }

  // Validate that price and stock are valid numbers
  if (isNaN(productData.price) || isNaN(productData.stock)) {
    return res.status(400).json({
      error: "Price and stock must be valid numbers",
      received: {
        price,
        stock,
      },
    });
  }

  try {
    const product = await ProductService.createProduct(productData);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;

    if (category) {
      // Jika ada category query parameter
      ProductService.getProductsByCategory(
        category,
        (err: any, products: Product[]) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json(products);
        }
      );
    } else {
      // Jika tidak ada query parameter, tampilkan semua produk
      ProductService.getAllProducts((err: any, products: Product[]) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(products);
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    ProductService.getProductById(
      Number(req.params.id),
      (err: any, product: Product) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!product)
          return res.status(404).json({ error: "Product not found" });
        res.status(200).json(product);
      }
    );
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  const { name, description, price, category, stock } = req.body;

  const productData = {
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
  };

  try {
    ProductService.updateProduct(
      Number(req.params.id),
      productData,
      (err: any) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(200).json({ message: "Product updated successfully" });
      }
    );
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    ProductService.deleteProduct(Number(req.params.id), (err: any) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(200).json({ message: "Product deleted successfully" });
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
