import express from "express";
import cors from "cors";
import "dotenv/config";
import { errorHandler } from "./middlewares";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { apiRouter } from "./routers";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import "./passport";

const app = express();

app.use(cookieParser());
const corsOrigins = process.env.CORS_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);

const { PORT } = process.env;
app.use(express.static(__dirname));

const swaggerSpec: any = YAML.load(path.join(__dirname, "./swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => console.log(`server is running ${PORT} `));
app.use(errorHandler);

export { app };
