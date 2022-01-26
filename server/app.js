const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    // useCreateIndex: false,
  })
  .then(() => console.log("db connected"))
  .catch((err) => console.log("db error", err));

const routes = require("./routes");

app.use(morgan("dev")); //shows requests in terminal
app.use(express.json()); //https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
// app.use(cors()) //allows all origins
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3003` }));
}

//when using middleware use "use" method
//whenever /api is called, app will use this middleware
app.use("/api/v1", routes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
