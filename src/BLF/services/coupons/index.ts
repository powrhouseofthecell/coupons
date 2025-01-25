import mongoose from "mongoose";
import Coupon, { Coupon_Schema_Interface } from "./coupons_modal";

// TODO: Move the interfaces to the types folder

interface Create_Coupon {
  code: string;
  type: "cart-wise" | "product-wise" | "BxGy";
  discount_details: {
    percentage?: number;
    flat_amount?: number;
    buy_count?: number;
    get_count?: number;
  };
  applicability: {
    min_cart_value?: number;
    applicable_products?: string[];
    buy_array?: string[];
    get_array?: string[];
  };
  repetition_limit?: number;
  start_date?: Date;
  end_date?: Date;
  created_by: string;
  email?: string;
  active: boolean;
}

const create_coupon = async ({
  code,
  type,
  discount_details,
  applicability,
  repetition_limit = 1,
  start_date = new Date(),
  end_date,
  created_by,
  email,
  active = true,
}: Create_Coupon): Promise<Coupon_Schema_Interface> => {
  const new_coupon = new Coupon({
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
  await new_coupon.save();
  return new_coupon;
};

interface Get_All_Coupons {
  filter?: {
    limit?: number;
    page?: number;
  };
}

const get_all_coupons = async ({ filter }: Get_All_Coupons): Promise<Coupon_Schema_Interface[]> => {
  const query = Coupon.find();

  const limit = filter?.limit || 20;
  const page = filter?.page || 1;
  const skip = (Math.abs(page) - 1) * limit;

  query.skip(skip).limit(limit);
  const coupons = await query;
  return coupons;
};

const get_coupon_by_id = async (id: mongoose.Types.ObjectId): Promise<Coupon_Schema_Interface | null> => {
  const coupon = await Coupon.findById(id);
  return coupon;
};

const get_coupons_by_type = async (type: "cart-wise" | "product-wise" | "BxGy"): Promise<Coupon_Schema_Interface[]> => {
  const coupons = await Coupon.find({ type });
  return coupons;
};

const get_active_coupons = async (): Promise<Coupon_Schema_Interface[]> => {
  const activeCoupons = await Coupon.find({ active: true });
  return activeCoupons;
};

// interface Update_Coupon {
//   id: mongoose.Types.ObjectId;
//   type?: "cart-wise" | "product-wise" | "BxGy";
//   discount_details?: {
//     percentage?: number;
//     flat_amount?: number;
//     buy_count?: number;
//     get_count?: number;
//   };
//   applicability?: {
//     min_cart_value?: number;
//     applicable_products?: string[];
//     buy_array?: string[];
//     get_array?: string[];
//   };
//   repetition_limit?: number;
//   start_date?: Date;
//   end_date?: Date;
//   active?: boolean;
// }

const update_coupon = async (id: mongoose.Types.ObjectId, updateData: Partial<Coupon_Schema_Interface>): Promise<Coupon_Schema_Interface | null> => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    return updatedCoupon;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw new Error("Unable to update coupon");
  }
};

// TODO: Fix the type of the parameter
const toggle_coupon_active = async ({ id, active }: any): Promise<Coupon_Schema_Interface | null> => {
  const coupon = await Coupon.findByIdAndUpdate(id, { active }, { new: true });
  return coupon;
};

const delete_coupon = async (id: mongoose.Types.ObjectId): Promise<Coupon_Schema_Interface | null> => {
  const deletedCoupon = await Coupon.findByIdAndDelete(id);
  return deletedCoupon;
};

const get_coupons_by_date_range = async ({ start_date, end_date }: { start_date: Date; end_date: Date }): Promise<Coupon_Schema_Interface[]> => {
  const coupons = await Coupon.find({
    start_date: { $gte: start_date },
    end_date: { $lte: end_date },
  });
  return coupons;
};

const get_coupons_by_cart_value = async ({ cart_value }: { cart_value: number }): Promise<Coupon_Schema_Interface[]> => {
  const coupons = await Coupon.find({
    "applicability.min_cart_value": { $lte: cart_value },
  });
  return coupons;
};

const get_coupon_by_code = async ({ code }: { code: string }): Promise<Coupon_Schema_Interface | null> => {
  const coupon = await Coupon.findOne({ code: code });
  return coupon;
};

const coupon_uc = {
  create_coupon,
  get_all_coupons,
  get_coupon_by_id,
  get_coupons_by_type,
  get_active_coupons,
  update_coupon,
  toggle_coupon_active,
  delete_coupon,
  get_coupons_by_date_range,
  get_coupons_by_cart_value,
  get_coupon_by_code,
};

export default coupon_uc;
