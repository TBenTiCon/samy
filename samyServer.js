const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const https = require("https");
var cors = require("cors");
const {
  expressCspHeader,
  INLINE,
  NONE,
  SELF,
  EVAL,
} = require("express-csp-header");

const app = express();

var whitelist = [
  "http://localhost:3720",
  "http://localhost:3722",
  "https://samy.reversedstudios.com",
  "https://mail.samy.reversedstudios.com",
  "https://app.samy.reversedstudios.com",
  "https://app.dealsale.de",
  "https://dealsale.de",
  "https://www.dealsale.de",
];

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.disable("etag");

const fs = require("fs");
/* const key = fs.readFileSync('./ssl/localhost.key');
const cert = fs.readFileSync('./ssl/localhost.crt'); */

//app.use(express.static('public'));

app.use("/", express.static(__dirname + "/public"));
app.use("/deal", express.static(__dirname + "/public"));
app.use("/company", express.static(__dirname + "/public"));

/* const dbURI =
  "mongodb+srv://dbUser:bfB1bnblRU01CmW2@cluster0.hkj6q.mongodb.net/sjMain?retryWrites=true&w=majority";
 */
const dbURI =
  "mongodb+srv://root:DealSale2021!@cluster0.pu1q8.mongodb.net/DealSale_Main?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    /* const server = https.createServer({ key: key, cert: cert }, app);
		server.listen(3720); */

    app.listen(3720);

    console.log("listening on port 3720 with db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());

app.use(express.static("public"));

//init viewEngine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(morgan("dev"));

app.use(
  expressCspHeader({
    directives: {
      "default-src": [SELF, "*"],
      "script-src": [SELF, INLINE, EVAL, "*"],
      "style-src": [SELF, INLINE, "*"],
      "font-src": [SELF, "data:"],
      "img-src": [SELF, "*", "data:", "blob:"],
      "connect-src": [SELF, "*", "blob:"],
      "worker-src": [NONE],
      "frame-src": ["*"],
      "block-all-mixed-content": true,
    },
  })
);

const baseRouter = require("./Routes/base");
app.use("/", baseRouter);

const newsletter = require("./Routes/newsletter");
app.use(newsletter);

const cRouter = require("./Routes/auth");
app.use("/", cRouter);

const dHandler = require("./Routes/dealHandler");
app.use(dHandler);

const pSettings = require("./Routes/pSettings");
app.use(pSettings);

app.post("*", (req, res) => {
  console.log("404!!!!");
  res.status(404).json({ status: "404" });
});
