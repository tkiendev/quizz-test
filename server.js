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

// Khởi động server
app.listen(port, () => {
  console.log(
    `===================== http://localhost:${port} ======================`,
  );
});
