import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Tables.css';

function Tables({ selectedTableId, setSelectedTableId }) {
  const [tables, setTables] = useState([]);
  
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decoded.role);
    }
  }, []);


  useEffect(() => {
    const fetchTables = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Unauthorized: Please log in again.');
          return;
        }

        const response = await axios.get('http://localhost:4000/get-tables', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        if (response.data && Array.isArray(response.data.tables)) {
          setTables(response.data.tables);

          if (response.data.selectedTableId) {
            setSelectedTableId(response.data.selectedTableId);
            localStorage.setItem('selectedTableId', response.data.selectedTableId);
          }
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
        alert('Failed to fetch tables. Please try again later.');
      }
    };

    fetchTables();
  }, [setSelectedTableId]);

  const handleFreeTable = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized: Please log in again.');
        return;
      }

      const response = await axios.post(
        'http://localhost:4000/update-table-status',
        { tableId: id, status: 'Available' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setTables(prevTables =>
          prevTables.map(table =>
            table.table_id === id ? { ...table, status: 'Available' } : table
          )
        );
        alert('Table status updated to Available');
      }
    } catch (error) {
      console.error('Error freeing table:', error);
      alert('Failed to update table status.');
    }
  };

  const handleSelectTable = async (id) => {
    const selectedTable = tables.find((table) => table.table_id === id);

    if (!selectedTable || selectedTable.status === 'Occupied') {
      alert('This table is already occupied. Please choose a different one.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized: Please log in again.');
        return;
      }

      const response = await axios.post(
        'http://localhost:4000/update-table-status',
        { tableId: id, status: 'Occupied' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success || response.data === 'yes') {
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.table_id === id ? { ...table, status: 'Occupied' } : table
          )
        );
        setSelectedTableId(id);
        localStorage.setItem('selectedTableId', id);
      } else {
        console.error('Error updating table status:', response.data.message);
        alert('Failed to update table status.');
      }
    } catch (error) {
      console.error('Error updating table status:', error);
      alert('Failed to update table status.');
    }
  };
  const isCustomer = userRole != 'staff';
  return (
    <div className="tables-container">
      <h2>Tables</h2>
      <div className="table-grid">
        {tables.map((table) => (
          <div key={table.table_id} className="table-box">
            <div className="table-header">
              <h3>Table {table.table_id}</h3>
              <p>Status: {table.status}</p>
            </div>
            <div className="table-body">
              {table.status === 'Available' && selectedTableId === null && isCustomer && (
                <button className="select-button" onClick={() => handleSelectTable(table.table_id)}>
                  Select Table
                </button>
              )}
              {isCustomer && selectedTableId === table.table_id && <p>Selected!</p>}

              {!isCustomer && (
                <>
                  {table.status === 'Occupied' && (
                    <button 
                      className="free-button"
                      onClick={() => handleFreeTable(table.table_id)}
                    >
                      Free Table
                    </button>
                  )}
                  {table.status === 'Available' && (
                    <p className="available-text">Table is Available</p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tables;
