import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import route from "./src/routes/index";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.config";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://tht01-fe.vercel.app",
  "https://tht01-be.vercel.app",
];

app.use(
  cors({
    origin: function (origin: any, callback: any) {
      // Allow requests with no origin like mobile apps or curl
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(route);
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("okeokeoek");
});
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`
  );
});
