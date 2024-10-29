import { Router } from "express";
const {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} = require("../controllers/productController");

const productRoute = Router();

productRoute.post("/products", createProductController);
productRoute.get("/products", getAllProductsController);
productRoute.get("/products/:id", getProductByIdController);
productRoute.put("/products/:id", updateProductController);
productRoute.delete("/products/:id", deleteProductController);

export default productRoute;
