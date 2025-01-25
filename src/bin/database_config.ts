import { default as mongoose } from "mongoose";

const connection_url =
  process.env.DATABASE_URL?.replace("<db_password>", process.env.DATABASE_PASSWORD || "") || "";

console.log(connection_url);
mongoose
  .connect(connection_url)
  .then((res) => {
    console.log(`Database connection successful! 👍`);
  })
  .catch((err) => {
    console.log(`Error connecting to database! 💥💥💥`);
    console.log(err);
  });

const connection = mongoose.connection;

function init(): void {
  console.log("Initializing database connection!");
}

export default { connection, init };
