var express = require("express");
var router = express.Router();

// GET home page.
router.get("/index", (req, res) => {
  res.render("index");
});

// GET final page
router.get("/home", (req, res) => {
  res.render("home");
});

// GET page with reduced data
router.get("/reduced", (req, res) => {
  res.render("reduced");
});

// GET about page.
router.get("/about", (req, res) => {
  res.render("about");
});

// GET table page.
router.get("/table", (req, res) => {
  res.render("table");
});

// GET robots.txt page.
router.get("/robots.txt", (req, res) => {
  res.render("robots");
});

// GET sitemap & sitemap.xml page.
router.get("/sitemap*", (req, res) => {
  res.render("sitemap");
});

// GET google-data-studio page.
router.get("/time-series*", (req, res) => {
  res.render("time-series");
});

// GET User Interface page.
router.get("/ui/", (req, res) => {
  console.log("get: '/ui/'");
  res.render("ui");
  return;
});

// GET all javascript files for import {} from "" statements
router.get("/public/javascripts/*", (req, res) => {
  if (req.url.slice(-2) == "js") return;
  res.redirect(`${req.url}.js`);
  return;
});

// GET home page if nothing else matches.
router.get("*", (req, res) => {
  res.redirect("home");
});

module.exports = router;
