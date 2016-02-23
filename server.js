var express = require('express');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var app = express();

app.get('/wellNumbers', function(req, res, next) {
  url = 'http://127.0.0.1:8080/claiborne1.html';
  request(url, function(err, res, html) {
    if (err) throw err;
    var $ = cheerio.load(html);

    var wellNum = [];
    // console.log($('table td').eq(26).text());
    for (var i = 4; i < 55000; i += 11) {
      var wellJson = {}
      wellJson.num = $('table td').eq([i]).text();
      wellNum.push(wellJson);
      console.log([i]);
      // console.log(wellJson)
    };
    fs.writeFile('claiborne1.json', JSON.stringify(wellNum, null, 4), function(err){
      if (err) throw err;
    })
  })
  next()
})

app.get('/wellNumbers2', function(req, res, next) {
  url = 'http://127.0.0.1:8080/claiborne2.html';
  request(url, function(err, res, html) {
    if (err) throw err;
    var $ = cheerio.load(html);
    var wellNum = [];
    for (var i = 4; i < 21000; i += 11) {
      var wellJson = {};
      wellJson.num = $('table td').eq([i]).text();
      wellNum.push(wellJson);
      console.log([i])
    };
    fs.writeFile('claiborne2.json', JSON.stringify(wellNum, null, 4), function(err) {
      if (err) throw err
    });
  })
  next()
})
app.get('/combineWells', function(req, res, next) {
  var wellNum;
  var wellNum2;
  fs.readFile('claiborne1.json', 'utf-8', function(err, data) {
    wellNum = JSON.parse(data);
    console.log(wellNum)
    fs.readFile('claiborne2.json', 'utf-8', function(err, data) {
      wellNum2 = JSON.parse(data);
      wellNum.push(wellNum2);
      console.log(wellNum)
      fs.writeFile('claiborne.json', JSON.stringify(wellNum, null, 4), function(err) {
        if (err) throw err;
      })
    })
  })

})
app.listen(9001);
