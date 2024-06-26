import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/post", postRoutes);
app.use("/api/generateImg", dalleRoutes);

//route
app.get("/", async (request, response) => {
  response.send("Hello from backend");
});

//to run the server
const startServer = async () => {
  //connect to database before running the server
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(8000, () => {
      console.log("Server has started on port http://localhost:8000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
