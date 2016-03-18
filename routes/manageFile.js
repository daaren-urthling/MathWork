var express = require('express');
var router = express.Router();
fs = require("fs");

var filesPath = "/public/files";

/* GET file list */
router.get('/', function(req, res, next) {
  fs.readdir(filesPath, function(err, files) {
    res.send(files);
  });
});

/* GET single file */
router.get('/:name', function(req, res, next) {
  console.log(req.params.name);
  fs.createReadStream(filesPath + req.params.name).pipe(res);
});

/* POST file */
router.post('/', function(req, res, next) {
    console.log(req.body.name);
    console.log(req.body.content);
    fs.writeFile(filesPath + '/' + req.body.name, req.body.content, { flag: 'w'}, function (err) {
        console.log('saving ...');
        if (err) {
            console.log(err);
            res.send({retCode : 1, retMsg : " Error:" + err});
        } else {
            res.send({retCode : 0, retMsg : 'The server has uploaded ' + req.body.name});
        }
    });

});

module.exports = router;
