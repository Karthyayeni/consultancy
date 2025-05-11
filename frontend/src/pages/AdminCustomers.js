import axios from 'axios';
import { useEffect, useState } from 'react';
import './AdminCustomers.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://consultancy-1-tdn6.onrender.com/api/customers');
      const filtered = res.data.filter(c => c.name.toLowerCase() !== 'admin');
      setCustomers(filtered);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEdit = (customer) => {
    setEditId(customer._id);
    setEditData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`https://consultancy-1-tdn6.onrender.com/api/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`https://consultancy-1-tdn6.onrender.com/api/customers/${id}`, editData);
      setEditId(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-customers-container">
      <h2>Customer List</h2>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                {editId === customer._id ? (
                  <>
                    <td><input type="text" name="name" value={editData.name} onChange={handleChange} /></td>
                    <td><input type="email" name="email" value={editData.email} onChange={handleChange} /></td>
                    <td><input type="text" name="phone" value={editData.phone} onChange={handleChange} /></td>
                    <td><input type="text" name="address" value={editData.address} onChange={handleChange} /></td>
                    <td>
                      <button onClick={() => handleUpdate(customer._id)}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>
                      <button onClick={() => handleEdit(customer)}>Edit</button>
                      <br></br>
                      <br></br>
                      <button onClick={() => handleDelete(customer._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCustomers;
