const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();
const allowedOrigins = [
  "http://localhost:5173", 
//   "https://task-management-app-git-main-dharamveer-singhs-projects.vercel.app",
//   "https://task-management-2y0nhcore-dharamveer-singhs-projects.vercel.app",
//   "task-management-app-six-phi.vercel.app",
//   "task-management-fc9pgs4ly-dharamveer-singhs-projects.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGOOSE_URI_STRING, {})
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });
});