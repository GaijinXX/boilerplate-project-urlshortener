require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('url');

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

app.post('/api/shorturl', function(req, res) {
  let origurl = req.body.url;
  dns.lookup(url.parse(origurl).host, (err, address, family) => {
    if(err) {
      res.json({ error: 'invalid url' });
    }
    else {
      let shorturl = arr.push(origurl) - 1;
      res.json({ original_url: origurl, short_url: shorturl });
    }
  });
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  res.redirect(arr[Number(req.params.shorturl)]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
