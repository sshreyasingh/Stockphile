const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectToDB = require("./config/db");
const cookieParser = require("cookie-parser");
connectToDB();
const indexRouter = require("./routes/index.routes");

// app.use(cors({
//   origin: ["https://your-frontend.vercel.app"],
//   credentials: true
// }));

const userRouter = require("./routes/user.routes");
const fileRoutes = require("./upload");
app.use("/api/files", fileRoutes);

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/upload", require("./upload"));

// Local/dev: serve Vite build. On Vercel, static files come from /public (CDN); this still helps local `node server/server.js`.
const distPath = path.join(__dirname, "../public");
app.use(express.static(distPath));

app.get(["/features", "/about"], (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

module.exports = app;
