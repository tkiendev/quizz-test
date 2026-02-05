const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// Middleware để parse JSON
app.use(express.json());

// Route cơ bản
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test.html"));
});
app.get("/test-1", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/test-2", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});
app.get("/test-3", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index3.html"));
});

// Khởi động server
app.listen(port, () => {
  console.log(
    `===================== http://localhost:${port} ======================`,
  );
});
