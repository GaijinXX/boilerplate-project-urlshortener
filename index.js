require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('url');
const mongoose = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let arr = [];

mongoose.connect('mongodb+srv://gaijin:killer01@cluster0.kfo2p.mongodb.net/shorturl?retryWrites=true&w=majority');

const UrlSchema = new mongoose.Schema({
  shortUrl: {type: String, required: true},
  originalUrl: {type: String, required: true},
});

const Url = mongoose.model('Url', UrlSchema);

app.post('/api/shorturl', async function(req, res) {
  console.log(await Url.countDocuments({}));
  let origurl = req.body.url;
  

  dns.lookup(url.parse(origurl).host, async (err, address, family) => {
    if(err || !url.parse(origurl).host) {
      res.json({ error: 'invalid url' });
    }
    else {
      let url = new Url({shortUrl: (await Url.countDocuments({}) + 1), originalUrl: origurl});
      res.json(url);
      url.save();
    }
  });
});

app.get('/api/shorturl/:shorturl', async function(req, res) {
  res.redirect((await Url.findOne({shortUrl: req.params.shorturl})).originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
