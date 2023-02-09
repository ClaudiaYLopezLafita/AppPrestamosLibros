var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('resource');
});
router.get('/:id', (req, res) => {

});
router.post('/', (req, res) => {

});
router.put('/:id', (req, res) => {

});
router.delete('/:id', (req, res) => {

});

module.exports = router;