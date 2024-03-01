const Booking = require('../models/Booking');
const Dentist = require('../models/Dentist');

//@desc Get all Bookings
//@route GET /api/v1/Bookings
//@access Public
exports.getBookings=async (req,res,next)=>{
    let query;
    
    //Reg users can see only their bookings!
    if(req.user.role !== 'admin'){
        query=Booking.find({user:req.user.id}).populate({
            path:'dentist',
            select: 'name experience expertise'
        });       
    }else{ //Admin can see all bookings!
        if(req.params.dentistId){
            console.log(req.params.dentistId);
            query = Booking.find({booking
: req.params.dentistId}).populate({
                path: 'dentist',
                select: 'name experience expertise'
            });
        }else
            query=Booking.find().populate({
                path:'dentist',
                select: 'name experience expertise'
            });
    }

    try{
        const Bookings= await query;
        res.status(200).json({
            success:true,
            count:Bookings.length,
            data: Bookings
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot find Booking"   
        })
    }
};

//@desc Get single Booking
//@route GET /api/v1/Bookings/:id
//@access Public
exports.getBooking=async (req,res,next)=>{
    try{
        const Booking= await Booking.findById(req.params.id).populate({
            path: 'dentist',
            select: 'name experience expertise'
        });
        
        if(!Booking){
            return res.status(404).json({success:false,message:`No Booking with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data:Booking
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Booking"});
    }
};

//@desc Add Booking
//@route POST /api/v1/books/:dentistId/Booking
//@access Private
exports.addBooking=async (req,res,next)=>{
    try{
        req.body.bookin=req.params.dentistId;
        const bookin= await bookin.findById(req.params.dentistId);
        
        if(!booking){
            return res.status(404).json({
                success:false,
                message:`No booking with the id of ${req.params.dentistId}`
            });
        }

        //add user Id to req.body
        req.body.user=req.user.id;
        //Check fot existed Booking
        const existedBookings = await Booking.find({user:req.user.id});
        //If the user is not an admin, they can only create 3 Booking.
        if(existedBookings.length >= 1 && req.user.role !== 'admin'){
            return res.status(400).json({
                success: false,
                message: 
                `The user with ID ${req.user.id} has already made a Booking`
            });
        }

        const Booking = await Booking.create(req.body);
        res.status(200).json({
            success:true,
            data: Booking
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot create Booking"
        });
    }
}

//@desc Update Booking
//@route PUT /api/v1/Bookings/:id
//@access Private
exports.updateBooking =async (req,res,next)=>{
    try{
        let Booking = await Booking.findById(req.params.id);
        
        if(!Booking){
            return res.status(404).json({
                success:false,
                message:`No Booking with the id of ${req.params.id}`
            });
        }

        //User Booking ownership
        if(Booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorized to update this Booking`
            });
        }

        Booking=await Booking.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data: Booking
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Booking"
        });
    }
}

//@desc Delete Booking
//@route DELETE /api/v1/Bookings/:id
//@access Private
exports.deleteBooking =async (req,res,next)=>{
    try{
        const Booking= await Booking.findById(req.params.id);
        
        if(!Booking){
            return res.status(404).json({
                success:false,
                message:`No Booking with the id of ${req.params.id}`
            });
        }

        //User Booking ownership
        if(Booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorized to delete this Booking`
            });
        }
        
        await Booking.deleteOne();
        res.status(200).json({
            success:true,
            data: {}
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Cannot delete Booking"
        });
    }
};
