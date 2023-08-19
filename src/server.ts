import express from "express";
import cors from "cors";
import "dotenv/config";
import { errorHandler } from "./middlewares";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();

app.use(
  cors({
    origin: [
      "http://34.64.245.195:8080",
      "kdt-sw-5-2-team01.elicecoding.com",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { PORT } = process.env;
app.use(express.static(__dirname));

app.use(errorHandler);

app.listen(PORT, () => console.log(`server is running ${PORT}`));

const swaggerSpec: any = YAML.load(path.join(__dirname, "./swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { app };
