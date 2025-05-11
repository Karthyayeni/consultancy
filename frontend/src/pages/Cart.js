import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [address, setAddress] = useState('');
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem('UserId');
  console.log(userId);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`https://consultancy-1-tdn6.onrender.com/api/cart/${userId}`);
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(`https://consultancy-1-tdn6.onrender.com/api/user/${userId}`);
        setUserDetails(data);
        setAddress(data.address || '');
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    // Check if user is logged in
    if (userId) {
      setIsLoggedIn(true);
      fetchCart();
      fetchUserDetails();
    } else {
      setIsLoggedIn(false);
    }
  }, [userId]);
  
  const updateQuantity = async (itemName, newQty) => {
    if (newQty < 1) return;

    try {
      await axios.put(`https://consultancy-1-tdn6.onrender.com/api/cart/update/${userId}`, {
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
      await axios.delete(`https://consultancy-1-tdn6.onrender.com/api/cart/remove/${userId}`, {
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
    if (!address.trim()) {
      alert('Please provide a delivery address.');
      return;
    }

    try {
      await axios.post('https://consultancy-1-tdn6.onrender.com/api/order', {
        userId,
        items: cartItems,
        totalAmount,
        address,
      });

      setOrderPlaced(true);
      await axios.delete(`https://consultancy-1-tdn6.onrender.com/api/cart/clear/${userId}`);

      setTimeout(() => {
        setCartItems([]);
        setShowCheckout(false);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { returnUrl: '/cart' } });
  };

  // If user is not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <section className="cart-section">
        <div className="cart-header">
          <h2>Your Cart 🛒</h2>
        </div>
        <div className="login-prompt">
          <p>Please log in to view your cart and make purchases.</p>
          <button className="login-btn-1" onClick={handleLoginRedirect}>
            Log In
          </button>
        </div>
      </section>
    );
  }

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

                <div className="address-section">
                  <label>
                    <input
                      type="radio"
                      checked={useSavedAddress}
                      onChange={() => {
                        setUseSavedAddress(true);
                        setAddress(userDetails?.address || '');
                      }}
                    />
                    Use Saved Address: <strong>{userDetails?.address || 'Not Available'}</strong>
                  </label>
                  <br/>
                  <label>
                    <input
                      type="radio"
                      checked={!useSavedAddress}
                      onChange={() => {
                        setUseSavedAddress(false);
                        setAddress('');
                      }}
                    />
                    Enter New Address
                  </label>

                  {!useSavedAddress && (
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter delivery address"
                      rows="3"
                      required
                    />
                  )}
                </div>

                {/* Cart Summary */}
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