import React from 'react';

import DataTable from './dataTable';
export default function dashboard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'white', marginTop: '50px' }}>Usuarios habilitados</h1>
      <DataTable />
    </div>
  );
}
