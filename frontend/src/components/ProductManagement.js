import React, { useEffect, useState } from 'react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', brand: '', image: null, stocks: 0 });
  const [errors, setErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await response.json();
    setProducts(data);
  };

  const fetchBrands = async () => {
    const response = await fetch('http://localhost:5000/api/brands');
    const data = await response.json();
    setBrands(data);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
    setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Product name is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.price || isNaN(form.price) || form.price <= 0) newErrors.price = 'Valid price is required';
    if (!form.stocks || isNaN(form.stocks) || form.stocks < 0) newErrors.stocks = 'Valid stock amount is required';
    if (!form.brand) newErrors.brand = 'Please select a brand';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    const url = editingProductId
      ? `http://localhost:5000/api/products/${editingProductId}`
      : 'http://localhost:5000/api/products';
    const method = editingProductId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    fetchProducts();
    resetForm();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brand._id,
      image: null,
      stocks: product.stocks,
    });
    setEditingProductId(product._id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchProducts();
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', brand: '', image: null, stocks: 0 });
    setEditingProductId(null);
    setErrors({});
  };

  return (
    <div style={{ display: 'flex', padding: '20px', backgroundColor: '#e0f7fa' }}>
      {/* Form Section */}
      <div style={{
        marginRight: '20px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        flex: 1,
      }}>
        <h3 style={{ color: '#0288d1', textAlign: 'center' }}>{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '10px' }}>
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #0288d1',
                boxSizing: 'border-box'
              }}
            />
            {errors.name && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #0288d1',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '80px'
              }}
            />
            {errors.description && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.description}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #0288d1',
                boxSizing: 'border-box'
              }}
            />
            {errors.price && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.price}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              name="stocks"
              type="number"
              placeholder="Stocks"
              value={form.stocks}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #0288d1',
                boxSizing: 'border-box'
              }}
            />
            {errors.stocks && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.stocks}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <select
              name="brand"
              value={form.brand}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #0288d1',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>
            {errors.brand && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.brand}</div>}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />
          {errors.image && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.image}</div>}

          <button type="submit" style={{
            backgroundColor: '#0288d1',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}>
            {editingProductId ? 'Update Product' : 'Add Product'}
          </button>
          {editingProductId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                backgroundColor: '#b0bec5',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Product List Section */}
      <div style={{
        flex: 2,
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
      }}>
        <h3 style={{ color: '#0288d1', textAlign: 'center' }}>Products</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e1f5fe' }}>
              <th style={{ padding: '10px', border: '1px solid #0288d1' }}>Image</th>
              <th style={{ padding: '10px', border: '1px solid #0288d1' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #0288d1' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #0288d1' }}>Price</th>
              <th style={{ padding: '10px', border: '1px solid #0288d1' }}>Stocks</th>
              <th style={{ padding: '10px', border: '1px solid #0288d1' }}>Brand</th>
              <th style={{ padding: '10px', border: '1px solid #0288d1' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={{ textAlign: 'center' }}>
                <td style={{ padding: '10px', border: '1px solid #0288d1' }}>
                  {product.image && <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '4px' }} />}
                </td>
                <td style={{ padding: '10px', border: '1px solid #0288d1' }}>{product.name}</td>
                <td style={{ padding: '10px', border: '1px solid #0288d1' }}>{product.description}</td>
                <td style={{ padding: '10px', border: '1px solid #0288d1' }}>{product.price}</td>
                <td style={{ padding: '10px', border: '1px solid #0288d1' }}>{product.stocks}</td>
                <td style={{ padding: '10px', border: '1px solid #0288d1' }}>{product.brand.name}</td>
                <td style={{ padding: '10px', border: '1px solid #0288d1' }}>
                  <button onClick={() => handleEdit(product)} style={{
                    backgroundColor: '#0288d1',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '5px',
                  }}>Edit</button>
                  <button onClick={() => handleDelete(product._id)} style={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
