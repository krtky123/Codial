const express = require("express");
const router = express.Router();

const user_api_controllers = require("../../../controllers/api/v1/user_api");

router.post("/", user_api_controllers.createSession);

module.exports = router;
