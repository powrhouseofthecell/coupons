import mongoose from "mongoose";

export const new_db_id = ({ id }: { id: string | mongoose.Types.ObjectId }): mongoose.Types.ObjectId => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (err) {
    throw { message: "Invlid id" };
  }
};

export const validate_db_id = ({ id }: { id: string | mongoose.Types.ObjectId }) => {
  return mongoose.Types.ObjectId.isValid(id);
};
