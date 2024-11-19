import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <Carousel showArrows autoPlay infiniteLoop>
      {products.map((product) => (
        <div key={product._id}>
          <img src={product.imageUrl} alt={product.name} />
          <p className="legend">{product.name}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
