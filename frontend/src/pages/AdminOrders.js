import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/order/all');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="admin-orders-section">
      <h2>All Orders 📦</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, idx) => (
            <div key={idx} className="order-card">
              <p><strong>User:</strong> {order.userId?.name}</p>
              <p><strong>Address:</strong> {order.userId?.address}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} (x{item.quantity}) — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
