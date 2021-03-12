const express = require("express");
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3001;

const app = express();
var router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use('/', router);

/**
    Scrapes Indeed
  */
let getData = (html) => {
  const $ = cheerio.load(html);
  data = $('#searchCountPages').text().trim().split(' ')
  console.log(data);
  console.log(data[3])
  return data[3];
}

/**
    Gets {job, location} from client and starts scraping
  */
app.post('/api', (req, res) => {
  console.log(req.body)
  const url = 'https://www.indeed.com/jobs?q=' + req.body.job + '&l=' + req.body.location
  
  axios.get(url)
    .then(response => {
      console.log("sending to client");
      res.json({total: getData(response.data)})
    })
    .catch(err => {
      console.log(err);
    })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});