const { Router } = require("express");
const {
  getUsers,
  createUser,
  postLogin,
  deleteUser,
  blockUser,
  unLockUser,
} = require("../controllers/users");
const authenticateToken = require("../middleware/auth");
const router = Router();
router.post("/login", postLogin);
router.post("/add-user", createUser);
router.use(authenticateToken);
router.get("/users", getUsers);
router.delete("/users/", deleteUser);
router.put("/block", blockUser);
router.put("/unlock", unLockUser);
module.exports = router;
