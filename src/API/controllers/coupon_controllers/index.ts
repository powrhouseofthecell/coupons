import { Request, Response, NextFunction } from "express";

import catchAsync from "../../util/catchAsync";
import AppError from "../../util/appError";

import BLF from "../../../BLF/functions";
import { new_db_id } from "../../../utils/db_utils";

const add_coupon = catchAsync(
  async (
    req: Request<
      {},
      {},
      {
        code: any;
        type: any;
        discount_details: any;
        applicability: any;
        repetition_limit: any;
        start_date: any;
        end_date: any;
        created_by: any;
        email: any;
        active: any;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    const { code, type, discount_details, applicability, repetition_limit, start_date, end_date, created_by, email, active } = req.body;

    if (!code || !type || !discount_details || !applicability || !created_by)
      return next(new AppError("code, type, discount_details, applicability, and created_by are required!", 400));

    const coupon = await BLF.create_coupon({
      code,
      type,
      discount_details,
      applicability,
      repetition_limit,
      start_date,
      end_date,
      created_by,
      email,
      active,
    });

    res.status(201).json({
      status: "success",
      data: coupon,
    });
  }
);

const get_coupons = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query);
  const coupons = await BLF.get_all_coupons(req.query);

  res.status(200).json({
    status: "success",
    data: coupons,
  });
});

const get_coupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const param_id = req.params.coupon_id;
  const id = new_db_id({ id: param_id });
  const coupon = await BLF.get_coupon_by_id({ id });
  res.status(200).json({
    status: "success",
    data: coupon,
  });
});

const update_coupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const param_id = req.params.coupon_id;
  const id = new_db_id({ id: param_id });
  const update_data = req.body;
  const coupon = await BLF.update_coupon({ id, update_data });
  res.status(200).json({
    status: "success",
    data: coupon,
  });
});

const toggle_active_coupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const param_id = req.params.coupon_id;
  const id = new_db_id({ id: param_id });
  const { active } = req.body;
  const coupon = await BLF.toggle_coupon_active({ id, active });
  res.status(200).json({
    status: "success",
    data: coupon,
  });
});

const delete_coupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const param_id = req.params.coupon_id;
  const id = new_db_id({ id: param_id });
  await BLF.delete_coupon({ id });
  res.status(200).json({
    status: "success",
  });
});

const get_coupons_by_date_range = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const start_date_query = req.query["start-date"] as string;
  const end_date_query = req.query["end-date"] as string;

  const start_date = new Date(start_date_query);
  const end_date = new Date(end_date_query);

  console.log(start_date, end_date);
  const coupons = await BLF.get_coupons_by_date_range({ start_date, end_date });
  res.status(200).json({
    status: "success",
    data: coupons,
  });
});

const get_coupons_by_min_cart_value = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { cart_value } = req.body;
  const coupons = await BLF.get_coupons_by_min_cart_value({ cart_value });
  res.status(200).json({
    status: "success",
    data: coupons,
  });
});

const apply_coupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { cart_value, code } = req.body;

  if (!cart_value || !code) {
    return res.status(400).json({ message: "Cart value and coupon code are required." });
  }

  // Fetch coupon details
  const coupon = await BLF.get_coupon_by_code({ code });
  if (!coupon || !coupon.active) {
    return res.status(404).json({ message: "Invalid or inactive coupon." });
  }

  // Check coupon expiry
  const now = new Date();
  if (coupon.end_date && new Date(coupon.end_date) < now) {
    return res.status(400).json({ message: "Coupon has expired." });
  }

  let discount_flat_amount = 0;
  let discount_percentage = 0;
  let discount = 0;

  // Handling cart-wise coupon
  if (coupon.type === "cart-wise") {
    // Check if the cart meets the minimum value requirement
    if (coupon.applicability.min_cart_value && cart_value < coupon.applicability.min_cart_value) {
      return res.status(400).json({ message: "Cart does not meet the minimum value for this coupon." });
    }

    // Apply the flat discount amount
    discount_flat_amount = coupon.discount_details.flat_amount || 0;

    // Apply the percentage discount
    if (coupon.discount_details.percentage) {
      discount_percentage = (cart_value * coupon.discount_details.percentage) / 100;
    }

    console.log(cart_value, coupon.discount_details.percentage);
    console.log(discount_flat_amount, discount_percentage, discount);
  }

  // Handling product-wise coupon
  if (coupon.type === "product-wise") {
    // This part depends on your product structure. You would need to check if the cart has the required products and quantities
    // Example logic: Check if all required products exist in cart and apply discounts
    // For simplicity, here's an example:
    // const requiredProduct = cart.products.find(p => p.product_id === coupon.applicability.product_id);
    // if (requiredProduct) {
    //   discount_flat_amount = coupon.discount_details.flat_amount || 0;
    //   discount_percentage = (requiredProduct.price * coupon.discount_details.percentage) / 100;
    // }
  }

  // Handling Buy X Get Y Free (BxGy) coupon
  if (coupon.type === "BxGy") {
    // Example logic for Buy X Get Y Free:
    // Check if the cart has the required products and quantities
    // Example: Buy 2, Get 1 Free
    // if cart has 3 items, discount the cost of 1
    // const requiredProduct = cart.products.find(p => p.product_id === coupon.applicability.product_id);
    // if (requiredProduct) {
    //   const freeItems = Math.floor(requiredProduct.quantity / coupon.applicability.buy_x);
    //   discount_flat_amount = freeItems * requiredProduct.price;
    // }
  }

  // Get the maximum of flat amount and percentage discount
  discount = Math.max(discount_flat_amount, discount_percentage);

  // Calculate the final total after applying the discount
  const final_total = cart_value - discount;

  // Return the result
  return res.status(200).json({
    message: "Coupon applied successfully.",
    cart: {
      original_total: cart_value,
      discount,
      final_total,
    },
  });
});

export default {
  add_coupon,
  get_coupons,
  get_coupon,
  update_coupon,
  toggle_active_coupon,
  delete_coupon,
  get_coupons_by_date_range,
  get_coupons_by_min_cart_value,
  apply_coupon,
};
