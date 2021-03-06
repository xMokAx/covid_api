const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const matchesRouter = require("./routes/matches");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("database connected...")
);

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello Covid");
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(express.json());

authRouter(app);
matchesRouter(app);

app.listen(process.env.PORT || 5000, () => console.log("server is running..."));
