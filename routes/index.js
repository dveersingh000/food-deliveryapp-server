const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
    res.send("Food Delivery Application");
})

module.exports = router;