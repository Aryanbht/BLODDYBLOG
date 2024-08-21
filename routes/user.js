const { Router } = require("express");
const router = Router();
const User = require("../models/user");

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPassword(email, password);
    console.log("token", token);
    return res.cookie("token", token).redirect("/");

  } catch (error) {
    return res.render("signin" , {
      error : "Invalid Password or Email",
    })
  }
});

router.get("/logout" , (req, res) => {
  res.clearCookie("token").redirect("/");
})

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
