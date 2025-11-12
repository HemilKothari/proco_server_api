const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const jobRoute = require("./routes/job");
const bookmarkRoute = require("./routes/bookmark");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/messages");
const filterRoute = require("./routes/filter");
const matchRoute = require("./routes/match");
const swipeRoute = require("./routes/swipe");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", authRoute);
app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/bookmarks", bookmarkRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/filters", filterRoute);
app.use("/api/matches", matchRoute);
app.use("/api/swipes", swipeRoute);

var port = process.env.PORT || 4000;
const ip = "192.168.1.117";

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
