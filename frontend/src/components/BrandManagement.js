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
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    const url = editingBrandId
      ? `http://localhost:5000/api/brands/${editingBrandId}`
      : 'http://localhost:5000/api/brands';
    const method = editingBrandId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    fetchBrands();
    resetForm();
  };

  const handleEdit = (brand) => {
    setForm({ name: brand.name, description: brand.description, image: null });
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
      <div style={{
        flex: '1',
        marginRight: '20px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ color: '#0288d1' }}>Create Brand</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              marginBottom: '10px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #0288d1',
            }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              marginBottom: '10px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #0288d1',
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />
          <button type="submit" style={{
            backgroundColor: '#0288d1',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}>
            {editingBrandId ? 'Update Brand' : 'Create Brand'}
          </button>
          {editingBrandId && (
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

      {/* Brand List Section */}
      <div style={{
        flex: '2',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
      }}>
        <h3 style={{ color: '#0288d1' }}>Your Brands</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0288d1', color: 'white' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Description</th>
              <th style={{ padding: '10px' }}>Image</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} style={{ backgroundColor: '#e1f5fe' }}>
                <td style={{ padding: '10px' }}>{brand.name}</td>
                <td style={{ padding: '10px' }}>{brand.description}</td>
                <td style={{ padding: '10px' }}>
                  {brand.image && (
                    <img src={`http://localhost:5000/${brand.image}`} alt={brand.name} width="50" style={{ borderRadius: '4px' }} />
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleEdit(brand)} style={{
                    backgroundColor: '#ffca28',
                    marginRight: '5px',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(brand._id)} style={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandManagement;
