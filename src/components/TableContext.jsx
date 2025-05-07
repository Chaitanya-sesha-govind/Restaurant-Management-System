import React, { createContext, useState } from 'react';

// Create context
export const TableContext = createContext();

// Create provider component
export const TableProvider = ({ children }) => {
  const [selectedTableId, setSelectedTableId] = useState(null);

  return (
    <TableContext.Provider value={{ selectedTableId, setSelectedTableId }}>
      {children}
    </TableContext.Provider>
  );
};
