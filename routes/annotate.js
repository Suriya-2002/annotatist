const express = require('express');

const annotateController = require('./../controllers/annotate');

const router = express.Router();

router.post('/open', annotateController.postAnnotateOpen);

router.get('/:frameNumber', annotateController.getAnnotate);
router.post('/:frameNumber', annotateController.postAnnotate);

module.exports = router;
