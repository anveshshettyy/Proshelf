const mongoose = require('mongoose');

const connectDB = async() => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
}

module.exports = { connectDB };

