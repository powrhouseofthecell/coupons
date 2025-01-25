import mongoose, { Document } from "mongoose";

export interface Coupon_Schema_Interface extends Document {
  code: string;
  type: "cart-wise" | "product-wise" | "BxGy";
  discount_details: {
    percentage?: number;
    flat_amount?: number;
    get_count?: number;
  };
  applicability: {
    min_cart_value?: number;
    applicable_products?: string[];
    buy_array?: string[];
    get_array?: string[];
  };
  repetition_limit?: number; // how many time the coupon can be used
  start_date?: Date;
  end_date?: Date;
  created_by: string;
  email?: string;
  active: boolean;
}

const Coupon_Schema = new mongoose.Schema<Coupon_Schema_Interface>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["cart-wise", "product-wise", "BxGy"],
    },
    discount_details: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      flat_amount: {
        type: Number,
        min: 0,
      },
      buy_count: {
        type: Number,
        min: 0,
      },
      get_count: {
        type: Number,
        min: 0,
      },
    },
    applicability: {
      min_cart_value: {
        type: Number,
        min: 0,
      },
      applicable_products: {
        type: [String],
      },
      buy_array: {
        type: [String],
      },
      get_array: {
        type: [String],
      },
    },
    repetition_limit: {
      type: Number,
      default: 1,
      min: 1,
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
    },
    created_by: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model<Coupon_Schema_Interface>("Coupon", Coupon_Schema);

export default Coupon;
