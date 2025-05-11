import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('UserId');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/order/myorders', {
          params: { userId },
        });
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMyOrders();
    } else {
      setLoading(false);
      console.error('User ID not found!');
    }
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/order/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <section className="my-orders-section">
      <h2>My Orders 📦</h2>

      {loading ? (
        <p>Loading your orders...</p>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            orders.map((order, idx) => (
              <div key={idx} className="order-card">
                <p><strong>User:</strong> {order.userId?.name || 'Unknown User'}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} (x{item.quantity}) — ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>

                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default MyOrders;
