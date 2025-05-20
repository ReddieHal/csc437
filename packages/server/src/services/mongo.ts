import mongoose from "mongoose";
import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

function getMongoURI(dbname: string) {
  const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;

  let connection_string = process.env.MONGO_CLUSTER;

  console.log("Connecting to MongoDB at ", connection_string);
  return connection_string;
}

export function connect(dbname: string) {
  mongoose
    .connect(getMongoURI(dbname))
    .catch((error) => console.log(error));
}