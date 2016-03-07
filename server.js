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
      wellNum.push(wellJson.num);
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
      wellNum.push(wellJson.num);
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
app.get('/wellsNoKey', function(req, res, next) {
  var wellNum;
  var wellNum2;
  fs.readFile('claiborne1.json', 'utf-8', function(err, data) {
    wellNum = JSON.parse(data);
    console.log(wellNum)
    fs.readFile('claiborne2.json', 'utf-8', function(err, data) {
      wellNum2 = JSON.parse(data);
      var newArray = wellNum.concat(wellNum2)
      console.log(newArray.length)
      // console.log(wellNum)
      fs.writeFile('claiborne.json', JSON.stringify(newArray, null, 4), function(err) {
        if (err) throw err;
      })
    })
  })

})
app.get('/scrapeClaiborne', function(req, res, next) {
  fs.readFile('claiborne.json', 'utf-8', function(err, data) {
    for (var key in data) {
      function myLoop() {
        setTimeout(function() {
          console.log(key)
          if (key < 50){
            myLoop()
          }
        }, 4000)
      }
              myLoop();
    }
  })

})

// app.get('/testing', function(req, res, next) {
//   var wellArray = [];
//   fs.readFile('claiborne.json', 'utf-8', function(err, data) {
//     wellArray = JSON.parse(data);
//     //console.log(wellArray);
//     // for (var i = 0; i < wellArray.length; i++) {
//     //   console.log([i])
//     // }
//     var len = wellArray.length;
//     var i = 0;
//     // console.log(wellArray[0]);
//     // for (var i = 0; i < len; i++) {
//     //   console.log(wellArray[i])
//     // }
//
//     var i = 1
//     var wellArray = [];
//     function myLoop() {
//       setTimeout(function() {
//         url = 'http://localhost:8080/well' +i+ '.html';
//         request(url, function(err, res, html) {
//
//           var json = {};
//
//           console.log(wellArray)
//             var $ = cheerio.load(html);
//           json.serialNum = $('table td').eq(2).text();
//           json.orgId = $('table td').eq(3).text();
//           wellArray.push(json)
//           // console.log(wellArray)
//         })
//         i++
//
//         if (i < len){myLoop()}
//
//       }, 2000)
//
//     }
//
//       myLoop()
app.get('/lolzor', function(req, res, next) {
  var i = 1
  var wellArray = [];
  function myLoop() {
    setTimeout(function() {
      url = 'http://localhost:8080/well' +i+ '.html';
      request(url, function(err, res, html) {
        var json = {};
        //console.log(wellArray)
        var $ = cheerio.load(html);
        json.serialNum = $('table td').eq(2).text();
        if (json.serialNum === '') return
        json.orgId = $('table td').eq(3).text();
        wellArray.push(json)
        console.log(wellArray)
        fs.writeFile('output.json', JSON.stringify(wellArray, null, 4), function(err) {})
      })
      i++
      if (i < 4){myLoop()}
    }, 2000)
  }
    myLoop()
});

app.listen(9001);
