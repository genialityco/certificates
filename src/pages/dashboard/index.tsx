import { Container, Group } from '@mantine/core';
import React from 'react';

import OverlayMenu from '~/components/Overlay/OverlayMenu';

import DataTable from './dataTable';
export default function dashboard() {
  return (
    <Container>
      <Group justify="space-between" mt="md">
        <h1 style={{ color: 'white' }}>Usuarios habilitados</h1>
        <OverlayMenu />
      </Group>
      <DataTable />
    </Container>
  );
}
