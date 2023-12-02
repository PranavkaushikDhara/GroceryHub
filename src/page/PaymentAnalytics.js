import React, { useState, useEffect } from 'react';

const PaymentAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [showBarGraph, setShowBarGraph] = useState(false);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/payment-analytics`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const calculateBarColor = (percentage) => {
    const hue = (percentage / 100) * 120;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const sortedAnalyticsData = analyticsData.sort((a, b) => b.totalPayments - a.totalPayments);
  const maxTotalPayments = Math.max(...analyticsData.map(item => item.totalPayments));

  const handleShowBarGraph = () => {
    setShowBarGraph(true);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Payment Analytics</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Phone</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Address</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {sortedAnalyticsData.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item._id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.phone}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.address}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.totalPayments}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
  style={{
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',  // Green color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  }}
  onClick={handleShowBarGraph}
>
  Show Bar Graph
</button>
      {showBarGraph && analyticsData.length > 0 ? (
        <>
          
          <div style={{ width: '100%', margin: '20px 0' }}>
            {sortedAnalyticsData.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '150px', textAlign: 'right', marginRight: '10px' }}>{item._id}:</div>
                <div
                  style={{
                    flex: '1',
                    height: '20px',
                    borderRadius: '5px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(item.totalPayments / maxTotalPayments) * 100}%`,
                      height: '100%',
                      backgroundColor: calculateBarColor(item.totalPayments),
                      borderRadius: '5px',
                      transition: 'width 0.5s ease-in-out',
                    }}
                    title={`Total Payments: ${item.totalPayments}%`}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: '#000',
                      fontSize: '12px',
                      pointerEvents: 'none',
                    }}
                  >
                    {item.totalPayments}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#000000', fontSize: '14px' }}>
            Note: The bar lengths represent the percentage of total orders.
          </p>
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>No payment analytics data available.</p>
      )}
    </div>
  );
};

export default PaymentAnalytics;