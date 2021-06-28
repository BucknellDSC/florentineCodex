var express = require('express');
var router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ annotations: [] })
  .write();

/* GET all annotations. */
router.get('/', function(req, res, next) {
    res.render('annotations', { title: 'annotations' });
});

module.exports = router;
