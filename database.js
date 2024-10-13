require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })
        console.log('Database connection successful');
    }catch(err){
        console.error('Connection failed!', err);
        process.exit(1);
    }

}
module.exports = connectDB;