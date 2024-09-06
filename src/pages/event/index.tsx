import { ActionIcon, Box, Card, Container, Group, Input, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { fetchFilteredGlobal } from '../../api';

export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    const filters = { 'properties.numeroDocumento': inputValue };
    const data = await fetchFilteredGlobal("Attendee", filters);
    const user = data[0];
    if (user && user.certificates.length > 0) {
      const eventId = user.certificates[0].event._id;
      router.push(
        `/certificate?userId=${encodeURIComponent(user._id)}&eventId=${encodeURIComponent(eventId)}`
      );
    } else {
      alert('No existen certificados para este documento.');
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
        background: 'url(https://i.ibb.co/jLszgQc/Fondo.png) no-repeat center center',
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
