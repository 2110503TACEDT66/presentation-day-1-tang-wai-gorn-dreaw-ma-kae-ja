const express = require('express');


const router = express.Router();
const {getDentists, createDentist, getDentist, updateDentist, deleteDentist} = require('../controllers/dentists');

const bookingRouter = require('./bookings');
router.use('/:dentistId/bookings', bookingRouter);

const {protect, authorize} = require('../middleware/auth');
router.route('/').get(getDentists).post(protect, authorize('admin'), createDentist);
router.route('/:id').get(getDentist).put(protect, authorize('admin'), updateDentist).delete(protect, authorize('admin'), deleteDentist);

module.exports = router;
