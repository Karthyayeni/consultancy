import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./home/Home";
import AboutUs from "./pages/AboutUs";
import AdminCustomers from './pages/AdminCustomers';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from "./pages/AdminOrders";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import MyOrders from './pages/MyOrders';
import Products from './pages/Product';
import ProductManagement from './pages/ProductManagement';
import SalesReport from "./pages/SalesReport";
import Signup from "./pages/Signup";
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/admin/sales-report" element={<SalesReport/>} />
      </Routes>
    </Router>
  );
}

export default App;
