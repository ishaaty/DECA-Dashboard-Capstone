const express = require("express");
const path = require("path");
const checkJwt = require("../config/jwtConfig");
const { User } = require("../models");

const router = express.Router();

router.post("/home", checkJwt, async (req, res) => {
  const userRole = req.body.role;

    try {
      let content = null;
        if (userRole === "admin") {
          content = {
            html: '<CreateAnnounceBtn setAnnouncements={setAnnouncements} />'
          }
        }
        console.log(content)
        res.json(content);
    } catch (error) {
        console.error("Error displaying home page:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
