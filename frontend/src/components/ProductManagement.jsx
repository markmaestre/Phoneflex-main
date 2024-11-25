import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText, ThemeProvider, createTheme } from '@mui/material';

// Create a light theme (without any dark references)
const theme = createTheme({
  palette: {
    mode: 'light',  // Set the theme mode to light
    primary: {
      main: '#1976d2', // You can customize the color palette
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', brand: '', image: null, stocks: 0 });
  const [errors, setErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

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
        const imageUrl = params.row.image;  // Assuming `image` is a field in your product data
        const validImageUrl = imageUrl && imageUrl.startsWith('https://res.cloudinary.com')
          ? imageUrl
          : 'http://localhost:5000/uploads/default-placeholder.jpg'; // Fallback image if no valid URL

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
    <ThemeProvider theme={theme}>  {/* Apply the light theme here */}
      <Box sx={{ padding: 4, backgroundColor: '#e0f7fa' }}>
        {/* Add Product Section */}
        <Box sx={{
          padding: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 2,
          marginBottom: 4,
        }}>
          <Typography variant="h5" color="primary" align="center">{editingProductId ? 'Edit Product' : 'Add Product'}</Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              name="name"
              label="Product Name"
              value={form.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.price}
              helperText={errors.price}
            />
            <TextField
              name="stocks"
              label="Stock Amount"
              type="number"
              value={form.stocks}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.stocks}
              helperText={errors.stocks}
            />
            <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.brand}>
              <InputLabel>Brand</InputLabel>
              <Select
                name="brand"
                value={form.brand}
                onChange={handleInputChange}
                label="Brand"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.brand && <FormHelperText>{errors.brand}</FormHelperText>}
            </FormControl>
            <TextField
              type="file"
              onChange={handleFileChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.image}
              helperText={errors.image}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {editingProductId ? 'Update Product' : 'Add Product'}
            </Button>
          </form>
        </Box>

        {/* Product Table */}
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            checkboxSelection
            onSelectionModelChange={handleSelectionChange}
            disableSelectionOnClick
            getRowId={(row) => row._id}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2 }}
            onClick={handleBulkDelete}
            disabled={selectedProducts.length === 0}
            getRowId={(row) => row._id}
          >
            Delete Selected
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ProductManagement;
