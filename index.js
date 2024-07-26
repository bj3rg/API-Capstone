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
    const bodyData = req.body.q;

    const response = await axios.get(
      TV_URL + "/search/shows?q=" + `${bodyData}`
    );
    res.render("filter.ejs", { content: response.data });
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
