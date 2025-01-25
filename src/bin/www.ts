process.on("uncaughtException", (err) => {
  console.log("uncaught Exception! Shutting down");
  console.log(err);
  process.exit(1);
});

import dotenv from "dotenv";

// Configure environment variables
dotenv.config({ path: "config.env" });

import kafka from "../OM/kafka";
import { initialize_consumers } from "../OM/consumers/setup";

import { default as http } from "http";

import { default as database } from "../bin/database_config";

import app from "../API/app";

// CONNECT TO DATABASE: (to use require is essential here: require will execute the code in the database_config file). Alternatively, we can simply call a void function from the database_config module which will trigger the entire code execution.
// const connection = require("../bin/database_config");
database.init();

// CONNECT TO KAFKA
// Initialize kafka producers
kafka.init();

// Initialize kafka consumers
initialize_consumers();

// CONFIGURE SERVER (HTTP & HTTPS)
const http_server = http.createServer(app);

// Server port
const http_port = +(process.env.HTTP_PORT || 3000);

http_server.on("listening", () => {
  console.log(`HTTP server running on port ${http_port}`);
});

http_server.on("error", (err) => {
  console.log(`Error starting HTTP server 💥💥💥`);
});

// Start server
http_server.listen(http_port, "0.0.0.0", 0);

process.on("unhandledRejection", (err: Error) => {
  console.log("unhandled rejection... Exiting application");
  console.log(err.name, err.message);
  console.log(err);

  http_server.close(() => {
    process.exit(1);
  });
});
