import mongoose from "mongoose";
import { Coupon_Schema_Interface } from "../services/coupons/coupons_modal";
import coupon_uc from "../services/coupons";
import { get } from "http";

export interface Create_Coupon_BLF_Args {
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
}: Create_Coupon_BLF_Args): Promise<Coupon_Schema_Interface> => {
  const newCoupon = await coupon_uc.create_coupon({
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
  return newCoupon;
};

export interface Get_All_Coupons_BLF_Args {
  filter?: {
    limit?: number;
    page?: number;
  };
  search?: string;
}

const get_all_coupons = async (filter: Get_All_Coupons_BLF_Args) => {
  const coupons = await coupon_uc.get_all_coupons(filter);
  return coupons;
};

export interface Get_Coupon_BLF_Args {
  id: mongoose.Types.ObjectId;
}

const get_coupon_by_id = async ({ id }: Get_Coupon_BLF_Args): Promise<Coupon_Schema_Interface> => {
  const coupon = await coupon_uc.get_coupon_by_id(id);
  if (!coupon) {
    throw new Error("Coupon not found");
  }
  return coupon;
};

export interface Update_Coupon_BLF_Args {
  id: mongoose.Types.ObjectId;
  update_data: Partial<Coupon_Schema_Interface>;
}

const update_coupon = async ({ id, update_data }: Update_Coupon_BLF_Args): Promise<Coupon_Schema_Interface> => {
  const updated_coupon = await coupon_uc.update_coupon(id, update_data);

  if (!updated_coupon) {
    throw new Error("Failed to update coupon");
  }

  return updated_coupon;
};

export interface Toggle_Coupon_Active_BLF_Args {
  id: mongoose.Types.ObjectId;
  active: boolean;
}

const toggle_coupon_active = async ({ id, active }: Toggle_Coupon_Active_BLF_Args): Promise<Coupon_Schema_Interface | null> => {
  const updatedCoupon = await coupon_uc.toggle_coupon_active({
    id,
    active,
  });
  return updatedCoupon;
};

export interface Delete_Coupon_BLF_Args {
  id: mongoose.Types.ObjectId;
}

const delete_coupon = async ({ id }: Delete_Coupon_BLF_Args) => {
  const deleted_coupon = await coupon_uc.delete_coupon(id);
  return deleted_coupon;
};

export interface Get_Coupons_By_Date_Range_BLF_Args {
  start_date: Date;
  end_date: Date;
}

const get_coupons_by_date_range = async ({ start_date, end_date }: Get_Coupons_By_Date_Range_BLF_Args) => {
  const coupons = await coupon_uc.get_coupons_by_date_range({
    start_date,
    end_date,
  });
  return coupons;
};

export interface Get_Coupons_By_Cart_Value_BLF_Args {
  cart_value: number;
}

const get_coupons_by_min_cart_value = async ({ cart_value }: Get_Coupons_By_Cart_Value_BLF_Args) => {
  const coupons = await coupon_uc.get_coupons_by_cart_value({ cart_value });
  return coupons;
};

const get_coupon_by_code = async ({ code }: any) => {
  const coupon = await coupon_uc.get_coupon_by_code({ code });
  return coupon;
};

const BLF = {
  create_coupon,
  get_all_coupons,
  get_coupon_by_id,
  update_coupon,
  toggle_coupon_active,
  delete_coupon,
  get_coupons_by_date_range,
  get_coupons_by_min_cart_value,
  get_coupon_by_code,
};

export default BLF;
