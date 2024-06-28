import express from "express";

//Create express app
const app = express();

app.get("/", (req, res) => {
  res.send("hell");
});

export default app;
