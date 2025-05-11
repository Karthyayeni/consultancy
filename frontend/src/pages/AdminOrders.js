import axios from 'axios';
import { useEffect, useState } from 'react';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState('recent');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/order/all');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/order/${orderId}/deliver`);
      // Re-fetch orders to reflect update
      const { data } = await axios.get('http://localhost:5000/api/order/all');
      setOrders(data);
    } catch (error) {
      console.error('Failed to mark as delivered', error);
    }
  };

  const markAsShipped = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/order/${orderId}/ship`);

      
      const { data } = await axios.get('http://localhost:5000/api/order/all');
      setOrders(data);
    } catch (error) {
      console.error('Failed to mark as shipped', error);
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    switch (sortCriteria) {
      case 'recent':
        return new Date(b.placedAt) - new Date(a.placedAt);
      case 'oldest':
        return new Date(a.placedAt) - new Date(b.placedAt);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'amount':
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  

  return (
    <section className="admin-orders-section">
      <h2>All Orders 📦</h2>


      <div className="filters">
        <label>Sort By:</label>
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="recent">Recent Orders First</option>
          <option value="oldest">Oldest Orders First</option>
          <option value="status">Status (Alphabetical)</option>
          <option value="amount">Amount (Highest to Lowest)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-list">
          {sortedOrders.map((order, idx) => (
            <div key={idx} className="order-card">
              <p><strong>User:</strong> {order.userId?.name}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} (x{item.quantity}) — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>

              <p><strong>Status:</strong> {order.status}</p>

              <button
                className="ship-btn"
                onClick={() => markAsShipped(order._id)}
                disabled={order.status !== 'Placed'}
              >
                Mark as Shipped
              </button>
              <br />
              <button
                className="deliver-btn"
                onClick={() => markAsDelivered(order._id)}
                disabled={order.status === 'Cancelled' || order.status === "Delivered"}
              >
                Mark as Delivered
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
