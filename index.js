// imports
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

//port and app
const app = express();
const port = 3000;

const TV_URL = " https://api.tvmaze.com";

// initialize middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(TV_URL + "/singlesearch/shows/?q=girls");
    console.log(response.data);
    res.render("landing.ejs");
  } catch (error) {
    res.render("error.ejs", error.message);
  }
});
app.get("/home", async (req, res) => {
  res.render("home.ejs");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
