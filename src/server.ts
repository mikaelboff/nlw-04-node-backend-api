import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "HI IRMAO" });
});

app.post("/", (req, res) => {
  return res.json({ message: "Dados salvos com suesso" });
});

app.listen(3333, () => console.log("server is running"));
