import app from "./app.js";
import dotenv from "dotenv";

// dotEnv config
dotenv.config();

//env variables
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
