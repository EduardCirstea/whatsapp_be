import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./configs/logger.config.js";
//env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 5000;

//exit on mongodb error
mongoose.connection.on("error", (e) => {
  logger.error(`MongoDb connection error:${e}`);
  process.exit(1);
});

// mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

//MONGODB connection
mongoose.connect(DATABASE_URL).then(() => {
  logger.info("Connected to MongoDb");
});

//starting the server
let server;
server = app.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`);
});

//handle server erros

//socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
  },
});

io.on("connection", (socket) => {
  logger.info("Socket io connected succesfully");
});

const exitHandler = () => {
  if (server) {
    logger.info(`Server closed.`);
    process.exit(1);
  } else {
    process.exit(1);
  }
};
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info(`Server closed.`);
    process.exit(1);
  }
});
