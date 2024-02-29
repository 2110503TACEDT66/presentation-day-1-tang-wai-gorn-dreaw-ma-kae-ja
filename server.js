const express = require('express');
const detenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

detenv.config({path:'./config/config.env'});
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//set security header
app.use(helmet());

//prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
    windowsMs: 10*60*1000, // 10 mins
    max: 100
});
app.use(limiter);

//prevent hpp paran pollution
app.use(hpp());

//enable CORS
app.use(cors());


//Route files
const dentists = require('./routes/dentists');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');

app.use('/api/v1/dentists', dentists);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err, promise) => {
    console.log(`error: ${err.message}`);
    server.close(() => process.exit(1));
});


