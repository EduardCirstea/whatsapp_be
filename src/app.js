import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";
// dotEnv config
dotenv.config();

//Create express app
const app = express();

//Morgan-middleware as an HTTP request logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Helmet-helps you secure your express apps by setting various HTTP headers
app.use(helmet());

//Parse json request url - to parse json from body and url
app.use(express.json());

//Parse json request body
app.use(express.urlencoded({ extended: true }));

//Sanitize request data - middleware which sanitizes user-supplied data to prevent MongoDB operator injection
app.use(mongoSanitize());

//Enable cookie - parser-middleware to parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

//Comppersion - middleware to compress response bodies for all request that traverse through the middleware
app.use(compression());

//file upload
app.use(fileUpload({ useTempFiles: true }));

//Cors - middleware to protect and restrict access to the server
app.use(
  cors()
  // { origin: "http://localhost:3000" } - we are in development
);

//API v1 routes
app.use("/api/v1", routes);

//Error handling
app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app;
