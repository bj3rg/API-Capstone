// imports
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import e from "express";

//port and app
const app = express();
const port = 3000;
// Filter var
let bodyDataFilter;
let responseFilter;
let episodes;
const TV_URL = "https://api.tvmaze.com";

// initialize middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    res.render("landing.ejs");
  } catch (error) {
    res.render("error.ejs", error.message);
  }
});

app.get("/home", async (req, res) => {
  try {
    const response = await axios.get(TV_URL + "/shows");
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = response.data;
    const results = {};
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < result.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    let total;
    results.results = result.slice(startIndex, endIndex);
    const number = result.length / limit;
    console.log(number);
    if (number > Math.floor(number)) {
      total = Math.floor(number) + 1;
    } else {
      total = number;
    }

    res.render("home.ejs", { content: results, pages: total });
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/filter", async (req, res) => {
  try {
    bodyDataFilter = req.body.q;

    responseFilter = await axios.get(
      TV_URL + "/search/shows?q=" + `${bodyDataFilter}`
    );
    res.redirect(`/filter?q=${bodyDataFilter}`);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/filter", async (req, res) => {
  if (responseFilter.data.length > 0) {
    res.render("filter.ejs", { content: responseFilter.data });
  } else {
    res.render("landing.ejs");
  }
});

app.get("/movie", async (req, res) => {
  try {
    const id = req.query.id;
    const embed = req.query.embed;
    const response = await axios.get(TV_URL + `/shows/${id}?embed=${embed}`);
    const response2 = await axios.get(TV_URL + `/shows/${id}/seasons`);
    const dataResponse2 = response2.data;
    let episodes = [];
    let seasons = [];

    // Get all seasons
    for (let i = 0; i < dataResponse2.length; i++) {
      // Get episode of current season by ID
      seasons.push(dataResponse2[i].id);
    }
    console.log(episodes);
    res.render("detail.ejs", {
      content: response.data,
      seasons: seasons,
      episodes: episodes,
    });
  } catch (error) {}
});

app.get("/get-episode", async (req, res) => {
  const seasonId = req.query.season;
  const seriesId = req.query.seriesId;
  try {
    const response = await axios.get(TV_URL + `/seasons/${seasonId}/episodes`);
    episodes = response.data;
    res.render("detail.ejs", {});
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
