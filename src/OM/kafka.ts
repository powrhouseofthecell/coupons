import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "zuhaib",
  brokers: ["192.168.31.212:9092"],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  // sasl: {
  //   mechanism: "plain",
  //   username: process.env.KAFKA_USERNAME!,
  //   password: process.env.KAFKA_PASSWORD!,
  // },
  // retry: {
  //   retries: 20,
  //   maxRetryTime: 3000,
  // },
});

const producer = kafka.producer();

producer
  .connect()
  .then(() => {
    console.log("Kafka producer connection successful 👍");
  })
  .catch((err) => {
    console.error("Error connecting to Kafka producer 💥💥💥", err);
  });

async function shutdown() {
  try {
    await producer.disconnect();
    console.log("Kafka producer disconnected");
  } catch (err) {
    console.error("error disconnecting Kafka producer", err);
  }
}

function init() {
  console.log("initializing kafka");
}

export { producer, shutdown, init, kafka };

export default {
  kafka,
  producer,
  shutdown,
  init,
};
