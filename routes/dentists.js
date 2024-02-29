const express = require('express');


const router = express.Router();
const {getDentists, createDentist, getDentist, updateDentist, deleteDentist} = require('../controllers/dentists');

router.route('/').get(getDentists).post(createDentist);
router.route('/:id').get(getDentist).put(updateDentist).delete(deleteDentist);
module.exports = router;
