import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const userId = localStorage.getItem('UserId');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId]);

  const updateQuantity = async (itemName, newQty) => {
    if (newQty < 1) return;

    try {
      await axios.put(`http://localhost:5000/api/cart/update/${userId}`, {
        itemName,
        quantity: newQty,
      });

      const updatedItems = cartItems.map(item =>
        item.name === itemName ? { ...item, quantity: newQty } : item
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemName) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${userId}`, {
        data: { itemName },
      });

      const filteredItems = cartItems.filter(item => item.name !== itemName);
      setCartItems(filteredItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      // Send order to backend
      await axios.post('http://localhost:5000/api/order', {
        userId,
        items: cartItems,
        totalAmount,
      });

      

      setOrderPlaced(true);
      // Optionally clear cart from database
      await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`);
  
      // Clear cart from state
      setTimeout(() => {
        setCartItems([]);
        setShowCheckout(false);
      }, 2000);  // 2-second delay

    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  

  return (
    <section className="cart-section">
      <div className="cart-header">
        <h2>Your Cart 🛒</h2>
        {cartItems.length > 0 && (
          <div className="checkout-top-right">
            <button className="checkout-btn" onClick={() => setShowCheckout(!showCheckout)}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items-container">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item-card">
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ₹{item.price}</p>

                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                  </div>

                  <p>Total: ₹{item.price * item.quantity}</p>

                  <button className="remove-btn" onClick={() => removeItem(item.name)}>
                    Remove
                  </button>
                </div>
                
              </div>
            ))}
          </div>

          {showCheckout && (
            <div className="checkout-modal">
              <div className="checkout-modal-content">
                <h3>Checkout Summary 🧾</h3>
                <ul>
                  {cartItems.map((item, i) => (
                    <li key={i}>
                      {item.name} (x{item.quantity}) — ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
                <h4>Total Amount: ₹{totalAmount}</h4>
                <button className="place-order-btn" onClick={placeOrder}>
                  Place Order
                </button>
                {orderPlaced && <p>Order placed successfully! 🎉</p>}
                <button className="close-btn" onClick={() => setShowCheckout(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Cart;
