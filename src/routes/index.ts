import { Router } from "express";

import productRoute from "./productRoutes";

const router = Router();

router.use("/", productRoute);

export default router;
