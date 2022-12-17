import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
mongoose.set("strictQuery", true);
import UserRouter from "./routes/userRoute.js";
import PostRouter from "./routes/postRoute.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import StoryRouter from "./routes/storyRoute.js";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.use(
  "assets/image/upload",
  express.static(
    path.join(__dirname, "../frontend/public/assets/image/upload/")
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/assets/image/upload/");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  try {
    return res.status(200).json("successful");
  } catch (err) {
    console.log(err);
  }
});

app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);
app.use("/api/story", StoryRouter);

app.use(express.static(path.join(__dirname,"/frontend/build")));
app.get("*",function (req, res) {
  res.sendFile(path.join(__dirname,"/frontend/build/index.html"))
})

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.Port || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
