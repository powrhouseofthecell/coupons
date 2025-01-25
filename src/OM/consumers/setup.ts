import { EachMessagePayload } from "kafkajs";

import { kafka } from "../kafka";
import consumer_controllers from "./consumer_controllers";

const consumer = kafka.consumer({ groupId: "client-hq" });

const initialize_consumers = async () => {
  console.log("initializing kafka consumers.");
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ["node_CRUD"], fromBeginning: true });

    console.log("Kafka consumer successfully connected");

    await consumer.run({
      eachMessage: consumer_controller,
    });
  } catch (err) {
    console.error("Error connecting Kafka consumer 💥💥💥", err);
  }
};

async function consumer_controller({ topic, partition, message, heartbeat, pause }: EachMessagePayload) {
  if (message.key?.toString() === "CREATE") {
    if (message.value?.toString()) {
      await consumer_controllers.on_create_user({
        message: message.value?.toString("base64"),
      });

      return;
    }
  }

  return;
}

export { initialize_consumers };
