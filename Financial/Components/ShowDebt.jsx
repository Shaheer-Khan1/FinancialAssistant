import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDebts() {
  const [debts, setDebts] = useState([]);  // State for storing all debts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch debts once on component mount
  useEffect(() => {
    const fetchDebts = async () => {
      const userEmail = JSON.parse(localStorage.getItem('userData'))?.email;

      if (!userEmail) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/auth/showdebts', { email: userEmail });
        setDebts(response.data.debts);
      } catch (err) {
        console.error('Error fetching debts:', err);
        setError('Failed to fetch debts.');
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Separate debts into taken and lended
  const lendedDebts = debts.filter(debt => debt.type === 'Lended');
  const takenDebts = debts.filter(debt => debt.type === 'Taken');

  // Handle "Taken" button click (for lended debts)
  const handleTakenClick = async (debt) => {
    try {
      await axios.delete('http://localhost:5000/api/auth/debts', {
        data: {
          description: debt.description,
          amount: debt.amount,
          date: debt.date,
          type: 'Lended'  // Mark it as Lended if it's a Lended debt
        }
      });
      setDebts((prevDebts) => prevDebts.filter(item => item.description !== debt.description || item.amount !== debt.amount || item.date !== debt.date));
      alert('Debt marked as taken and deleted successfully.');
    } catch (err) {
      console.error('Error deleting debt:', err);
      alert('Failed to delete debt.');
    }
  };

  // Handle "Lended" button click (for taken debts)
  const handleLendedClick = async (debt) => {
    try {
      await axios.delete('http://localhost:5000/api/auth/debts', {
        data: {
          description: debt.description,
          amount: debt.amount,
          date: debt.date,
          type: 'Taken'  // Mark it as Taken if it's a Taken debt
        }
      });
      setDebts((prevDebts) => prevDebts.filter(item => item.description !== debt.description || item.amount !== debt.amount || item.date !== debt.date));
      alert('Debt marked as lended and deleted successfully.');
    } catch (err) {
      console.error('Error deleting debt:', err);
      alert('Failed to delete debt.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        {/* Lended Debts Table */}
        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
          <h2 style={{ textAlign: 'center' }}>Lended Debts</h2>
          {lendedDebts.length === 0 ? (
            <p>No lended debts found.</p>
          ) : (
            <div style={{ height: '200px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Amount</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lendedDebts.map((debt) => (
                    <tr key={`${debt.description}-${debt.amount}-${debt.date}`}>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{debt.description}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{debt.amount}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                        {new Date(debt.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleTakenClick(debt)}
                          style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none' }}
                        >
                          Taken
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Taken Debts Table */}
        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
          <h2 style={{ textAlign: 'center' }}>Taken Debts</h2>
          {takenDebts.length === 0 ? (
            <p>No taken debts found.</p>
          ) : (
            <div style={{ height: '200px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Amount</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {takenDebts.map((debt) => (
                    <tr key={`${debt.description}-${debt.amount}-${debt.date}`}>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{debt.description}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{debt.amount}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                        {new Date(debt.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleLendedClick(debt)}
                          style={{ padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none' }}
                        >
                          Returned
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
