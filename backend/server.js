const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db");
const cartRoutes = require('./routes/cart'); 
const customerRoutes = require('./routes/Customers');
const userRoutes = require('./routes/UserRoutes');
const orderRoutes = require('./routes/order');
const salesRoutes = require('./routes/salesReport');
const reviewRoutes = require('./routes/ReviewRoutes');
const authRoutes = require("./routes/auth");
const notificationRoutes = require('./routes/notification');
const adminRoutes = require('./routes/adminroutes');
const productRoutes = require("./routes/productRoutes");
const PORT = process.env.PORT || 5000;
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://consultancy-duek.onrender.com",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/customers', customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/api',salesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/admin', adminRoutes);

app.post('/webhook', (req, res) => {
  console.log('Received webhook event:', req.body);
  res.status(200).send('Received');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
