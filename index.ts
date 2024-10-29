import express from "express";
import dotenv from "dotenv";
import db from "./src/libs/db";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const allowedOrigins = [
//   "https://dumbmerch-dun.vercel.app",
//   // Add other allowed origins here
// ];

// app.use(route);
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("okeokeoek");
});
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
