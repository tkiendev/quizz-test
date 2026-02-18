const express = require("express");
const { kv } = require("@vercel/kv");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

/**
 * 1. API Khởi tạo kho lì xì (Chạy 1 lần duy nhất hoặc khi muốn nạp thêm lộc)
 * Bạn có thể dùng Postman hoặc truy cập vào route này để reset kho.
 */
app.get("/api/admin/reset-stock", async (req, res) => {
  const initialStock = {
    "10.000 VNĐ": 50, // Số lượng 50 bao
    "20.000 VNĐ": 20,
    "50.000 VNĐ": 10,
    "100.000 VNĐ": 5,
    "200.000 VNĐ": 2,
  };
  await kv.set("lixi_stock", initialStock);
  res.json({ success: true, message: "Đã nạp kho lì xì mới!" });
});

/**
 * 2. API Nhận thông tin và bốc lì xì
 */
app.post("/api/send-lixi", async (req, res) => {
  const { name, bank, account } = req.body;

  try {
    // Lấy kho hàng từ KV
    let stock = await kv.get("lixi_stock");
    if (!stock)
      return res
        .status(400)
        .json({ success: false, error: "Kho chưa được khởi tạo!" });

    // Lọc danh sách các mệnh giá còn số lượng > 0
    const availablePrizes = Object.keys(stock).filter((key) => stock[key] > 0);

    if (availablePrizes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Hết lì xì mất rồi, hẹn bạn năm sau nhé!",
      });
    }

    // Bốc ngẫu nhiên 1 mệnh giá từ danh sách còn hàng
    const randomPrize =
      availablePrizes[Math.floor(Math.random() * availablePrizes.length)];

    // Trừ số lượng trong kho và cập nhật lại KV
    stock[randomPrize] -= 1;
    await kv.set("lixi_stock", stock);

    // Lưu lịch sử giao dịch
    const newItem = {
      id: Date.now(),
      name,
      bank,
      account,
      amount: randomPrize,
      time: new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      }),
    };

    let lixiList = (await kv.get("lixi_list")) || [];
    lixiList.push(newItem);
    await kv.set("lixi_list", lixiList);

    // Trả về mệnh giá bốc được cho Client
    res.json({ success: true, amount: randomPrize });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// API Lấy danh sách cho Admin (Xem ai đã trúng gì)
app.get("/api/admin/list", async (req, res) => {
  try {
    const lixiList = (await kv.get("lixi_list")) || [];
    const stock = await kv.get("lixi_stock");
    res.json({ lixiList, stock });
  } catch (e) {
    res.json({ lixiList: [], stock: {} });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "home2.html"));
});

module.exports = app;
