var express = require('express');
var router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ annotations: [] })
  .write();

/* add an annotation. */
router.post('/', function(req, res, next) {
  const newAnno = {
    id: req.body['@id'],
    content: req.body,
    target_canvas: req.body.on[0].full,
    within: req.body.on[0].within['@id']
  };
  const result = db.get('annotations')
        .push(newAnno)
        .write().find(anno => anno.id === newAnno.id);

  res.send(result);
});

/* GET all annotations. */
router.get('/', function(req, res, next) {
  // If there are query parameters, look for
  // annotations on a specific canvas.
  if (req.query.target_canvas) {
    const target_canvas = decodeURIComponent(req.query.target_canvas);
    const result = db.get('annotations').value().filter(annotation => {
      return annotation.target_canvas ?
        (annotation.target_canvas === target_canvas) : false;
    }).map(anno => anno.content);

    res.send(result);
    return;
  }

  const result = db.get('annotations');
  res.send(result);
});

/* GET annotations with a specific ID */
router.get('/:uid', function(req, res, next) {
  const id = req.params.uid;

  // select the canvas id out of the get query parameter
  const result = db.get('annotations').find(anno => anno.id === id).value();
  res.send(result);
});


/* update annotation. */
router.put('/:uid', function(req, res, next) {
  const id = req.params.uid;
  const newAnno = {
    id: req.body['@id'],
    content: req.body,
    target_canvas: req.body.on[0].full,
    within: req.body.on[0].within['@id']
  };

  // select the annotation id out of the query parameters
  const result = db.get('annotations')
        .find({ id: id })
        .assign(newAnno)
    .write();

  res.send(result);
});

/* delete annotation. */
router.delete('/:uid', function(req, res, next) {
  const id = req.params.uid;
  // select out the annotation ID to address it
  const result = db.get('annotations').remove({ id: id }).write();
  res.send(result);
});

module.exports = router;
