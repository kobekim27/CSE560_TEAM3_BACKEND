const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// PostgreSQL 연결 (Supabase용)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 프론트엔드로부터 쿼리 받기
app.post("/query", async (req, res) => {
  const { query } = req.body;

  console.log("📥 Received query from frontend:");
  console.log(query);

  try {
    const result = await pool.query(query);
    console.log("✅ Query result:", result.rows);

    res.status(200).json({ results: result.rows });
  } catch (err) {
    console.error("❌ Query error:", err.message);

    res.status(400).json({
      error: err.message,
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
