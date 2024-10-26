const express = require("express");
const { addExpense, getExpenses, getBalance } = require("../controllers/expenseController");
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

router.post("/add", auth, addExpense);
router.get("/", auth, getExpenses);
router.get("/balance", auth, getBalance);

module.exports = router;
