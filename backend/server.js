const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());


app.get("/contacts", (req, res) => {
  db.all("SELECT * FROM contacts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.post("/contacts", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)";
  db.run(sql, [name, email, phone], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, email, phone });
  });
});


app.delete("/contacts/:id", (req, res) => {
  db.run("DELETE FROM contacts WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedID: req.params.id });
  });
});

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
