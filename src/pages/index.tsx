import { ActionIcon, Box, Card, Container, Group, Input, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { fetchEventUsersData } from '../api';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const transformFilters = (filters) => {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  return filters.map((filter) => ({
    field: filter.id,
    value: filter.value,
    comparator: 'like',
  }));
};

export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    const filters = [{ id: 'properties.numeroDocumento', value: inputValue }];
    const transformedFilters = transformFilters(filters);
    const data = await fetchEventUsersData(1, 10, transformedFilters);
    const user = data.data[0];
    if (data.data.length === 0) {
      alert('No existe certificado para este documento.');
    }
    if (user) {
      router.push(
        `/certificate?name=${encodeURIComponent(user.properties.names)}&documento=${encodeURIComponent(
          user.properties.numeroDocumento
        )}`
      );
    }
  };

  return (
    <Container
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'url(https://i.ibb.co/v3PX5Kz/Fondo.png) no-repeat center center',
        backgroundSize: 'contain',
      }}
      fluid
    >
      <Box px="xl" py="lg">
        <Group position="center">
          <Text size="xl" color="white" mt="lg">
            ¡Bienvenido! Consulta y descarga tu certificado
          </Text>
        </Group>

        <Card withBorder shadow="sm" mt="xl" padding="lg">
          <Text size="md" mb="md" align="center" weight={500}>
            Para consultar ingresa tu número de documento
          </Text>
          <Group>
            <Input
              placeholder="Número de documento"
              radius="md"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ width: '80%' }}
            />
            <ActionIcon variant="filled" color="blue" onClick={handleSearch} style={{ width: '10%' }}>
              <FaSearch />
            </ActionIcon>
          </Group>
        </Card>
      </Box>
    </Container>
  );
}
