// cartRoute.ts
import { Router } from "express";

const {
  createCartController,
  getAllCartController,
  getCartByIdController,
  updateCartController,
  deleteCartController,
} = require("../controllers/cartController");

const cartRoute = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated id of the cart
 *         userId:
 *           type: string
 *           description: ID of the user who owns the cart
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *           description: Array of products in cart
 *         totalAmount:
 *           type: number
 *           description: Total amount of the cart
 */

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       400:
 *         description: Invalid input
 */
cartRoute.post("/", createCartController);

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get all carts
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: List of all carts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */
cartRoute.get("/", getAllCartController);

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     summary: Get cart by id
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart id
 *     responses:
 *       200:
 *         description: Cart found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 */
cartRoute.get("/:id", getCartByIdController);

/**
 * @swagger
 * /carts/{id}:
 *   put:
 *     summary: Update a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 */
cartRoute.put("/:id", updateCartController);

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     summary: Delete a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart id
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 */
cartRoute.delete("/:id", deleteCartController);

export default cartRoute;
