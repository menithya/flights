var express = require('express');
var router = express.Router();
var request=require('request')
var moment = require('moment');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));


router.get('/',function(req,res,next){
  var from = req.query.from;
  var to = req.query.to;
  var date = req.query.date;
  var twodDayBeofre=moment(date).subtract(2,'days').format('YYYY-MM-DD');
  var oneDayBefore=moment(date).subtract(1,'days').format('YYYY-MM-DD');
  var currentDate=date;
  var twoDaysAfter=moment(date).add(2,'days').format('YYYY-MM-DD');
  var oneDayAfter=moment(date).add(1,'days').format('YYYY-MM-DD');
  console.log(twodDayBeofre)
  console.log(date)

  var url='http://node.locomote.com/code-task/airlines';
  request(url,function(err,resp,body){
  	// console.log(body)
  	var airlinesArr=JSON.parse(body);
  	var length=airlinesArr.length;
  	// console.log(airlinesArr)
  	var urls=[];
  	var searchBaseURL='http://node.locomote.com/code-task/flight_search/'
  	console.log("hello",length);
  	for(var k=0; k<length; k++){
  		urls.push(searchBaseURL + airlinesArr[k].code + '?date=' + twodDayBeofre + '&from=' + from + '&to=' + to);

  		urls.push(searchBaseURL + airlinesArr[k].code + '?date=' + oneDayBefore + '&from=' + from + '&to=' + to);
  		urls.push(searchBaseURL + airlinesArr[k].code + '?date=' + currentDate + '&from=' + from + '&to=' + to);
  		urls.push(searchBaseURL + airlinesArr[k].code + '?date=' + oneDayAfter + '&from=' + from + '&to=' + to);
  		urls.push(searchBaseURL + airlinesArr[k].code + '?date=' + twoDaysAfter + '&from=' + from + '&to=' + to);
  	}

	    var searchResults=[]
	  	Promise.map(urls, function(url) {
	      return request(url).then(function(response) {
	      	// console.log(response.body)
	        JSON.parse(response.body).forEach(function(item) {
	          searchResults.push(item);
	        });
	      });
	    }).then(function() {
	      res.send(searchResults);
	    });
  });

})

module.exports = router;
