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

app.use(
  cors({
    origin: "https://tht01-fe.vercel.app",
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
