import { Router } from "express";
import cartRoute from "./cartRoute";
const {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} = require("../controllers/productController");

const productRoute = Router();

productRoute.post("/", createProductController);
productRoute.get("/", getAllProductsController);
productRoute.get("/:id", getProductByIdController);
productRoute.put("/:id", updateProductController);
productRoute.delete("/:id", deleteProductController);

export default productRoute;
