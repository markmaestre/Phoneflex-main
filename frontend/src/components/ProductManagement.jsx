import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', brand: '', image: null, stocks: 0 });
  const [errors, setErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]); // For storing selected products to delete

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

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      const response = await fetch('http://localhost:5000/api/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ids: selectedProducts }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`${data.message}`);
        fetchProducts(); // Reload the product list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during bulk delete:', error);
      alert('An error occurred while deleting products.');
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedProducts(newSelection.rowIds); // Ensure this correctly updates the selected product IDs
    console.log('Selected Products:', newSelection.rowIds); // Debugging
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', brand: '', image: null, stocks: 0 });
    setEditingProductId(null);
    setErrors({});
  };

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => {
        const imageUrl = params.value;  // The image URL from the row data
        const validImageUrl = imageUrl && imageUrl.startsWith('http') ? imageUrl : 'http://localhost:5000/uploads/default-placeholder.jpg'; // fallback image
        return (
          <img
            src={validImageUrl}
            alt={params.row.name}
            style={{ width: '50px', height: '50px', borderRadius: '4px' }}
          />
        );
      },
    },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'stocks', headerName: 'Stocks', width: 100 },
    { field: 'brand', headerName: 'Brand', width: 150, renderCell: (params) => params.row.brand.name },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)} variant="contained" color="primary" style={{ marginRight: '8px' }}>Edit</Button>
          <Button onClick={() => handleDelete(params.row._id)} variant="contained" color="secondary">Delete</Button>
        </>
      )
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#e0f7fa' }}>
      {/* Add Product Section */}
      <div style={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
      }}>
        <h3 style={{ color: '#0288d1', textAlign: 'center' }}>{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit} noValidate>
          {/* Form Inputs */}
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', resize: 'vertical' }}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <input
            name="stocks"
            type="number"
            placeholder="Stocks"
            value={form.stocks}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <select
            name="brand"
            value={form.brand}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />
          <Button type="submit" variant="contained" color="primary">{editingProductId ? 'Update Product' : 'Add Product'}</Button>
        </form>
      </div>

      {/* Product List Section */}
      <div style={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ color: '#0288d1', textAlign: 'center' }}>Product List</h3>
        {/* Bulk Delete Button */}
        <Button onClick={handleBulkDelete} variant="contained" color="secondary" style={{ marginBottom: '10px' }}>
          Bulk Delete
        </Button>

        {/* DataGrid */}
        <div style={{ height: '400px', width: '100%', overflowY: 'auto' }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            checkboxSelection
            onSelectionModelChange={handleSelectionChange}
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
