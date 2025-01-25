import { Buffer } from "buffer";

import BLF from "../../BLF/functions";

interface On_Create_Node {
  message: string;
}

// Add a new coupon when a new user is created
// TODO: handle errors
async function on_create_user({ message }: On_Create_Node) {
  const message_json = Buffer.from(message, "base64").toString("utf8");
  const data_obj = JSON.parse(message_json);
  data_obj.node_id = data_obj._id;

  await BLF.create_coupon(data_obj);
}

export default {
  on_create_user,
};
