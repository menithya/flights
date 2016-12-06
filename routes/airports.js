var express = require('express');
var router = express.Router();
var request=require('request')


router.get('/',function(req,res,next){
 var queryParam=req.query.q;
  console.log(queryParam)
  var url='http://node.locomote.com/code-task/airports?q='+queryParam;
  request(url,function(err,resp,body){
  	res.send(body);
  })

})

module.exports = router;
