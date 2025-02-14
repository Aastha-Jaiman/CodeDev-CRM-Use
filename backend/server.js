const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const app = express();
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./database/db.js");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const leadRouter = require("./routes/leadRoutes");
const todoRoutes = require("./routes/todoRoutes");
const stageRoutes = require("./routes/leadStageRoutes");
const todoStatusRoutes = require("./routes/todoStatusRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const teamRoutes = require("./routes/teamRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const googleAuth = require("./routes/googleAuthRoutes");
const taskRoutes = require("./routes/taskRoutes");
const workReportRoutes = require("./routes/workReportsRoutes");
const path = require("path");

const URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log(Incoming request: ${req.method} ${req.url});
//   next();
// });

// app.use(
//   cors({
//     origin: [ "http://localhost:3000", "https://codedev-crm-5fa3.onrender.com"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://codedev-crm-use.onrender.com"],
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: ["https://codedev-crm-use.onrender.com", "http://localhost:3000"],
//     credentials: true, // Allow cookies
//   })
// );
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const GoogleStrategy = require("./possport");

app.use("/auth", googleAuth);
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/lead", leadRouter);
app.use("/api/stage", stageRoutes);
app.use("/api/todoStatus", todoStatusRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contactUs", contactUsRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/taskRoutes", taskRoutes);
app.use("/api/workreports", workReportRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, async () => {
  await connectDB(URL);
  console.log(`Server running on Post- ${PORT}`.bgBlue.black);
});
