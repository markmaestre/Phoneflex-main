import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardMedia, Typography, TextField, Button, Select, MenuItem, CircularProgress } from '@mui/material';
import './css/ProductsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    maxPrice: '',
    brand: '',
    ratings: '',
  });

  useEffect(() => {
    const fetchProductsAndBrands = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get('http://localhost:5000/api/products');
        setProducts(productResponse.data);
        setFilteredProducts(productResponse.data);

        // Fetch unique brands from the products
        const uniqueBrands = [...new Set(productResponse.data.map((p) => p.brand?.name))];
        setBrands(uniqueBrands.filter(Boolean)); // Remove undefined/null brands

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products or brands', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProductsAndBrands();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Filter products
    const filtered = products.filter((product) => {
      // Filter by maxPrice
      const matchesMaxPrice =
        updatedFilters.maxPrice && !isNaN(updatedFilters.maxPrice)
          ? parseFloat(product.price) <= parseFloat(updatedFilters.maxPrice)
          : true;

      // Filter by brand
      const matchesBrand = updatedFilters.brand
        ? product.brand?.name === updatedFilters.brand
        : true;

      // Filter by ratings
      const averageRating =
        product.ratingCount > 0 ? product.totalRatings / product.ratingCount : 0;
      const matchesRatings =
        updatedFilters.ratings && !isNaN(updatedFilters.ratings)
          ? averageRating >= parseFloat(updatedFilters.ratings) &&
            averageRating <= 5
          : true;

      // Combine all conditions
      return matchesMaxPrice && matchesBrand && matchesRatings;
    });

    // Update the filtered products
    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setFilters({
      maxPrice: '',
      brand: '',
      ratings: '',
    });
    setFilteredProducts(products);
  };

  const handlePlaceOrder = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const product = products.find((prod) => prod._id === productId);

      if (!product) {
        alert('Product not found');
        return;
      }

      const orderData = {
        products: [{ productId: product._id, quantity, price: product.price }],
        totalPrice: product.price * quantity,
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
      alert(
        'Error placing order: ' + (err.response ? err.response.data.message : err.message)
      );
    }
  };

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <span key={index} className="star filled">★</span>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} className="star empty">☆</span>
        ))}
      </>
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-page">
      <Typography variant="h4" gutterBottom>All Products</Typography>

      {/* Filters */}
      <div className="filters">
        <TextField
          label="Max Price"
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          fullWidth
          margin="normal"
        />
        <Select
          label="Brand"
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select Brand</MenuItem>
          {brands.map((brand, index) => (
            <MenuItem key={index} value={brand}>{brand}</MenuItem>
          ))}
        </Select>
        <TextField
          label="Min Ratings (1-5)"
          type="number"
          name="ratings"
          value={filters.ratings}
          onChange={handleFilterChange}
          min="1"
          max="5"
          fullWidth
          margin="normal"
        />
        <Button onClick={resetFilters} variant="outlined" color="primary">
          All Products
        </Button>
      </div>

      {/* Product List */}
      <Grid container spacing={3}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const averageRating =
              product.ratingCount > 0
                ? (product.totalRatings / product.ratingCount).toFixed(1)
                : 0;

            return (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <Card>
                  {product.image && (
                    <CardMedia
                      component="img"
                      image={product.image} // Cloudinary URL provided by backend
                      alt={product.name}
                      height="200"
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{product.description || 'No description available'}</Typography>
                    <Typography variant="body1" color="primary">
                      ₱{product.price}
                    </Typography>
                    <Typography variant="body2">Stock: {product.stocks}</Typography>
                    <Typography variant="body2">
                      Brand: {product.brand?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      Ratings: {renderStars(parseFloat(averageRating))}
                    </Typography>
                    <TextField
                      type="number"
                      label="Quantity"
                      defaultValue="1"
                      inputProps={{ min: 1, max: product.stocks }}
                      fullWidth
                      margin="normal"
                      id={`quantity-${product._id}`}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handlePlaceOrder(
                          product._id,
                          parseInt(document.getElementById(`quantity-${product._id}`).value)
                        )
                      }
                      fullWidth
                    >
                      Place Order
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="body1" color="textSecondary">No products found matching the criteria.</Typography>
        )}
      </Grid>
    </div>
  );
};

export default ProductsList;
