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

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user', userRoutes);
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/productRoutes");
app.use('/api/cart', cartRoutes);
app.use('/api/customers', customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/order', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/api',salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
