const express = require("express");
const router = express.Router();

const {requireLogin, adminAuth} = require("../middleware/auth")

const { read, update } = require("../controllers/user");

router.get("/:id", requireLogin, read);
router.put("/update", requireLogin, update);
router.put("/admin/update", requireLogin, adminAuth, update)

module.exports = router;
