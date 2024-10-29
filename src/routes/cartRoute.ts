import { Router } from "express";

const {
  createCartController,
  getAllCartController,
  getCartByIdController,
  updateCartController,
  deleteCartController,
} = require("../controllers/cartController");

const cartRoute = Router();

cartRoute.post("/", createCartController);
cartRoute.get("/", getAllCartController);
cartRoute.get("/:id", getCartByIdController);
cartRoute.put("/:id", updateCartController);
cartRoute.delete("/:id", deleteCartController);

export default cartRoute;
