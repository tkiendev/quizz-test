const express = require("express");
const { kv } = require("@vercel/kv"); // Sử dụng KV thay cho fs
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// API Nhận dữ liệu
app.post("/api/send-lixi", async (req, res) => {
  const { name, bank, account, amount } = req.body;

  const newItem = {
    id: Date.now(),
    name,
    bank,
    account,
    amount,
    time: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
  };

  try {
    // Lấy danh sách cũ từ KV (nếu chưa có thì là mảng rỗng)
    let lixiList = (await kv.get("lixi_list")) || [];
    lixiList.push(newItem);

    // Lưu lại vào KV
    await kv.set("lixi_list", lixiList);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// API Lấy danh sách cho Admin
app.get("/api/admin/list", async (req, res) => {
  try {
    const lixiList = (await kv.get("lixi_list")) || [];
    res.json(lixiList);
  } catch (e) {
    res.json([]);
  }
});

// Các route giao diện
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "home2.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "admin-home.html"));
});

module.exports = app;
