const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const sassMiddleware = require("node-sass-middleware");
const path = require("path");

const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(expressLayouts);
app.use(
  sassMiddleware({
    src: "./assests/scss",
    dest: "./assests/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);
app.use(express.urlencoded());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("assests"));

app.use("/", require("./routes"));

app.listen(PORT, () => {
  console.log(`Server is up and running ${PORT}`);
});
