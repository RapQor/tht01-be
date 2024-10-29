import { Request, Response } from "express";

const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

export const createProductController = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct(Number(req.params.id), req.body);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    await deleteProduct(Number(req.params.id));
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
};
