import React, { useEffect, useState } from 'react';

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
        <h3>{editingBrandId ? 'Edit Brand' : 'Create Brand'}</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Brand Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />

          <div>
            <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>
              {editingBrandId ? 'Update Brand' : 'Create Brand'}
            </button>
            {editingBrandId && (
              <button type="button" onClick={resetForm} style={{ padding: '10px 20px' }}>
                Cancel
              </button>
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
        <h3>Your Brands</h3>
        <div style={{ height: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td>{brand.name}</td>
                  <td>{brand.description}</td>
                  <td>
                    <img
                      src={brand.image}
                      alt={brand.name}
                      style={{ width: '100px', height: 'auto' }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(brand)}
                      style={{ marginRight: '5px', padding: '5px 10px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand._id)}
                      style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrandManagement;
