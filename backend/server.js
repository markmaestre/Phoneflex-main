require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');



const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err));


app.use('/api/auth', authRoutes);
app.use('/api', brandRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes); 
app.use('/api', reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
