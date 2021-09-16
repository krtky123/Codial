const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const db = require("./config/mongoose");
const User = require("./models/user");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");

// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local");
const passportJWT = require("./config/passportJWT");
const passportGoogle = require("./config/passportGoogle");
const passportOutlook = require("./config/passportOutlook");

const MongoStore = require("connect-mongo")(session);

const saasMiddleware = require("node-sass-middleware");

const flash = require("connect-flash");
const flashMiddleware = require("./config/flashMiddleware");

// setup the chatserver
const chatServer = require("http").Server(app);
const chatSocket = require("./config/chatSockets").chatSocket(chatServer);
chatServer.listen(5000);

// setup the Notificationserver
const notificatonServer = require("http").Server(app);
const notificatonSocket = require("./config/notificatonSockets").notificatonSocket(
  notificatonServer
);
notificatonServer.listen(8080);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);

app.use(express.static("./assets"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// for style and link tags
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
// app.set('views', path.join(__dirname,'views'));
app.set("views", "./views");

// MW - encrypts session cookie and mongostore is used to store session cookie in db
app.use(
  session({
    name: "codial", // name of cookie
    secret: "byyyyyyycxeegv",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log("connect to Mongostore");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthUser); // set users for views

app.use(flash()); // send in session-cookie and erased after refresh

app.use(flashMiddleware.setFlash);

app.use("/", require("./routes/index"));

app.listen(port, function (error) {
  if (error) {
    console.log(`error in eunning server ${error}`);
    return;
  }
  console.log(`express server is running ${port}`);
});
