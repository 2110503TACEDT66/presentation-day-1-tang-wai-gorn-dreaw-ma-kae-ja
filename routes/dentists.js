const express = require('express');


const router = express.Router();
const {getDentists, createDentist, getDentist, updateDentist, deleteDentist} = require('../controllers/dentists');

//to-do: remove comment in line 9, 10 after finish booking

//const bookingRouter = require('./bookings');
//router.use('/:dentistId/bookings', bookingRouter);

router.route('/').get(getDentists).post(createDentist);
router.route('/:id').get(getDentist).put(updateDentist).delete(deleteDentist);

//to-do: after finish auth, change line 11,12 to commented line below

//const {protect, authorize} = require('../middleware/auth');
//router.route('/').get(getDentists).post(protect, authorize('admin'), createDentist);
//router.route('/:id').get(getDentist).put(protect, authorize('admin'), updateDentist).delete(protect, authorize('admin'), deleteDentist);

module.exports = router;
