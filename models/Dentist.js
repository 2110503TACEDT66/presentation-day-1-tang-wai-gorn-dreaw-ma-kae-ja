const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxLength: [50, 'Name cannot be more than 50 characters']
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    expertise: {
        type: String,
        required: [true, 'Please add area of expertise']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Reverse populate with virtuals
DentistSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField: 'dentist',
    justOne: false
});

//Cascade delete bookings when a dentist is deleted
DentistSchema.pre('deleteOne', {document: true, query: false}, async function (next) {
    console.log(`Bookings being removed from dentist ${this._id}`);
    await this.model('Booking').deleteMany({dentist: this._id});
    next(); 
});

module.exports = mongoose.model('Dentist', DentistSchema);