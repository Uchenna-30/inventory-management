import React from 'react';
import './bestseller.css';

const BestSellers = () => {
  const products = [
    {
      name: 'Kelly Bookshelf',
      sku: 'BR 8129',
      units: 124,
      pricePerUnit: 588,
      total: 72931
    },
    {
      name: 'Darcy Side Table',
      sku: 'BR 3039',
      units: 107,
      pricePerUnit: 188,
      total: 20116
    }
  ];

  return (
    <div className="bestsellers-card">
      <h3>Best Sellers This Quarter</h3>
      {products.map((product, index) => (
        <div className="bestseller-item" key={index}>
          <div className="product-name">{product.name}</div>
          <div className="product-sku">{product.sku}</div>
          <div className="product-info">
            <span className="units">{product.units} Units</span>
            <span className="price">${product.pricePerUnit} per unit</span>
            <span className="total">| ${product.total.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BestSellers;
