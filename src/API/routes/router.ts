import express from "express";
import coupons_router from "./coupons_router";

const router = express.Router();

router.use("/coupons", coupons_router);

export default router;
