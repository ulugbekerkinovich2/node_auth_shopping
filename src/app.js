require("dotenv/config");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const config = require("../config/index.js");
const authRoute = require("./routes/аuth.route");
const brandRoute = require("../src/routes/brand.route.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static(`${process.cwd()}/uploads`));
app.use("/api/auth", authRoute);
app.use("/brands", brandRoute);

const port = config.port || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
