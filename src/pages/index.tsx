import { ActionIcon, Box, Card, Container, Group, Input, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { fetchFilteredGlobal } from '../api';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// const transformFilters = (filters) => {
//   /* eslint-disable @typescript-eslint/ban-ts-comment */
//   // @ts-ignore
//   return filters.map((filter) => ({
//     field: filter.id,
//     value: filter.value,
//     comparator: 'like',
//   }));
// };

export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    const filters = { 'properties.numeroDocumento': inputValue };
    // const transformedFilters = transformFilters(filters);
    const data = await fetchFilteredGlobal('Attendee', filters);
    const user = data[0];
    if (user.certificates.length === 0) {
      alert('No existen certificados para este documento.');
      return;
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
        background: 'url(https://ik.imagekit.io/6cx9tc1kx/Fondo.png?updatedAt=1725565188343) no-repeat center center',
        backgroundSize: 'contain',
      }}
      fluid
    >
      <Box px="xl" py="lg">
        <Group justify="center">
          <Text size="xl" c="white" mt="lg">
            ¡Bienvenido! Consulta y descarga tu certificado
          </Text>
        </Group>

        <Card withBorder shadow="sm" mt="xl" padding="lg">
          <Text size="md" mb="md">
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
