const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = path.join(__dirname, "data.json");

// Render trang chủ (Thiệp)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Render trang Admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-home.html"));
});

// API Nhận dữ liệu từ thiệp
app.post("/api/send-lixi", (req, res) => {
  const { name, bank, account, amount } = req.body;

  let lixiList = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      lixiList = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch (e) {
      lixiList = [];
    }
  }

  const newItem = {
    id: Date.now(),
    name,
    bank,
    account,
    amount,
    time: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
  };

  lixiList.push(newItem);
  fs.writeFileSync(DATA_FILE, JSON.stringify(lixiList, null, 2));
  res.json({ success: true });
});

// API Lấy danh sách cho Admin
app.get("/api/admin/list", (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`🌸 Server chạy tại: http://localhost:${PORT}`);
  console.log(`🛠 Quản trị tại: http://localhost:${PORT}/admin`);
});
