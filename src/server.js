import express from "express";
import dotenv from "dotenv";
import middleware from "./middleware.js";
import search from "./search.js";

dotenv.config();

const app = express();
app.use("/", middleware);

app.use("/", search);

const port = process.env.PORT || 4040;
app.listen(port);
console.log("Server listening on port: ", port);
