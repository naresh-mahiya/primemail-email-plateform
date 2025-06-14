import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js'; // Ensure the `.js` extension is included
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRoute from './routes/userRoute.js'
import emailRoute from './routes/emailRoute.js'
import aiRoute from './routes/aiRoute.js'
import './controllers/emailSchedular.js'

dotenv.config();
const app = express();
connectDB();
const PORT = process.env.PORT || 8080;

//middleware
app.use(express.urlencoded({extended:true})); //when handling form submissions
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_URL ,
    // origin:true,
    credentials: true,
};
app.use(cors(corsOptions));

// app.get('/',async (req,res)=>{ res.status(200).json({message:'running okay'})})


//routes
app.use('/api/v1/user',userRoute);
app.use('/api/v1/email',emailRoute);
app.use('/api/v1/ai', aiRoute);



app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
