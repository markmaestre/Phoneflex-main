import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Typography } from '@mui/material';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', image: null });
  const [editingBrandId, setEditingBrandId] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const response = await fetch('http://localhost:5000/api/brands', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await response.json();
    setBrands(data);
  };

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);

    // Only append image if it's new
    if (form.image) {
      formData.append('image', form.image);
    }

    const url = editingBrandId
      ? `http://localhost:5000/api/brands/${editingBrandId}`
      : 'http://localhost:5000/api/brands';
    const method = editingBrandId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });

    if (response.ok) {
      fetchBrands(); // Fetch updated list of brands
      resetForm(); // Reset the form
    } else {
      console.error('Error updating/creating brand');
    }
  };

  const handleEdit = (brand) => {
    setForm({
      name: brand.name,
      description: brand.description,
      image: null, // Image will not be preloaded
    });
    setEditingBrandId(brand._id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/brands/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchBrands();
  };

  const resetForm = () => {
    setForm({ name: '', description: '', image: null });
    setEditingBrandId(null);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'image',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => <img src={params.value} alt={params.row.name} style={{ width: '100px', height: 'auto' }} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: '5px' }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', padding: '20px', backgroundColor: '#e0f7fa', minHeight: '100vh' }}>
      {/* Form Section */}
      <div
        style={{
          flex: '1',
          marginRight: '20px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          {editingBrandId ? 'Edit Brand' : 'Create Brand'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Brand Name"
            value={form.name}
            onChange={handleInputChange}
            fullWidth
            required
            style={{ marginBottom: '10px' }}
          />
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleInputChange}
            fullWidth
            required
            style={{ marginBottom: '10px' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />
          <div>
            <Button variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>
              {editingBrandId ? 'Update Brand' : 'Create Brand'}
            </Button>
            {editingBrandId && (
              <Button variant="contained" color="default" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Brand List Section */}
      <div
        style={{
          flex: '2',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          Your Brands
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={brands}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandManagement;
