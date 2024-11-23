import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ProductsList.css'; 

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePlaceOrder = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const product = products.find((prod) => prod._id === productId);

      if (!product) {
        alert('Product not found');
        return;
      }

      // Prepare order data
      const orderData = {
        products: [{ 
          productId: product._id,
          quantity,
          price: product.price 
        }], 
        totalPrice: product.price * quantity
      };

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert('Order placed successfully');
      }
    } catch (err) {
      console.error('Error placing order', err);
      alert('Error placing order: ' + (err.response ? err.response.data.message : err.message));
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <div className="products-container">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.image && (
              <img
                src={`http://localhost:5000/${product.image}`} // Ensure image path is correct here
                alt={product.name}
                className="product-image"
              />
            )}
            <div className="product-details">
              <h2>{product.name}</h2>
              <p>{product.description || 'No description available'}</p>
              <p><strong>Price:</strong> ₱{product.price}</p>
              <p><strong>Stock:</strong> {product.stocks}</p>
              <p><strong>Brand:</strong> {product.brand?.name || product.brand || 'Unknown'}</p>
              <input
                type="number"
                min="1"
                max={product.stocks}
                defaultValue="1"
                id={`quantity-${product._id}`}
              />
              <button
                className="order-button"
                onClick={() =>
                  handlePlaceOrder(
                    product._id,
                    parseInt(document.getElementById(`quantity-${product._id}`).value)
                  )
                }
              >
                Place Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
