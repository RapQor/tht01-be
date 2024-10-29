import { Router } from "express";

import productRoute from "./productRoutes";
import cartRoute from "./cartRoute";

const router = Router();

router.use("/products", productRoute);
router.use("/carts", cartRoute);

export default router;
