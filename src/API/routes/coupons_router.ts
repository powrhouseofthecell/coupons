import express from "express";

import coupons_controller from "../controllers/coupon_controllers";

const router = express.Router();

router.post("/", coupons_controller.add_coupon);
router.post("/apply", coupons_controller.apply_coupon);
router.get("/", coupons_controller.get_coupons);

router.get("/date-range", coupons_controller.get_coupons_by_date_range);
router.get("/cart", coupons_controller.get_coupons_by_min_cart_value);

router.patch("/active/:coupon_id", coupons_controller.toggle_active_coupon);
router.get("/:coupon_id", coupons_controller.get_coupon);
router.patch("/:coupon_id", coupons_controller.update_coupon);

// FIX: Following REST?
router.delete("/:coupon_id", coupons_controller.delete_coupon);

export default router;
