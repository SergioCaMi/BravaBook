import mongoose from "mongoose";
export async function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((x) =>
      console.log(
        `Connected to MongoDB! Database name: "${x.connections[0].name}"`
      )
    )
    .catch((err) => console.error("Error connecting to mongo", err));
}
 