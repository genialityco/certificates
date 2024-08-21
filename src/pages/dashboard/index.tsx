import { Container } from '@mantine/core';
import React from 'react';

import DataTable from './dataTable';
export default function dashboard() {
  return (
    <Container>
      <h1 style={{ color: 'white', marginTop: '50px' }}>Usuarios habilitados</h1>
      <DataTable />
    </Container>
  );
}
