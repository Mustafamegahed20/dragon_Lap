import React, { useState } from 'react';

const OrderTracking = () => {
  const [orderNo, setOrderNo] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add order tracking logic
    setResult(`Order status for ${orderNo} will be shown here.`);
  };

  return (
    <div>
      <h1>Track Your Order</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your order number"
          value={orderNo}
          onChange={e => setOrderNo(e.target.value)}
          required
        />
        <button type="submit">Track</button>
      </form>
      {result && <div>{result}</div>}
    </div>
  );
};

export default OrderTracking; 