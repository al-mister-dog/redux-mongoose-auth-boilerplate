const express = require("express");
const router = express.Router();

const {requireLogin} = require("../controllers/auth")

const { read, update } = require("../controllers/user");

router.get("/:id", requireLogin, read);
router.put("/update", requireLogin, update);

module.exports = router;
