import { ActionIcon, Box, Card, Container, Group, Input, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

import { fetchFilteredGlobal, fetchEventById } from '../../api';

// Tipado para el modelo de evento
interface EventData {
  _id: string;
  name: string;
  organization: string;
  userProperties: Record<string, unknown>;
  styles: {
    eventImage: string;
  };
}

export default function Page() {
  const [inputValue, setInputValue] = useState<string>('');
  const [eventData, setEventData] = useState<EventData | null>(null);
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    // Consulta inicial para obtener los detalles del evento
    if (eventId) {
      fetchEventById(eventId as string).then((data: EventData) => {
        setEventData(data);
      });
    }
  }, [eventId]);

  const handleSearch = async () => {
    if (!eventId) {
      alert('No se ha proporcionado el ID del evento.');
      return;
    }

    const filters = { 'properties.numeroDocumento': inputValue, event: eventId };
    const data = await fetchFilteredGlobal('Attendee', filters);
    const user = data[0];
    console.log(user);
    if (user) {
      router.push(`/certificate?attendeeId=${encodeURIComponent(user._id)}&eventId=${encodeURIComponent(eventId as string)}`);
    } else {
      alert('No existen certificados para este documento.');
    }
  };

  if (!eventData) {
    return <Text>Cargando datos del evento...</Text>;
  }

  return (
    <Container
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `url(${eventData.styles.eventImage}) no-repeat center center`,
        backgroundSize: 'contain',
      }}
      fluid
    >
      <Box px="xl" py="lg">
        <Group justify="center">
          <Text size="xl" c="white" mt="lg">
            ¡Bienvenido! Consulta y descarga tu certificado del evento: {eventData.name}
          </Text>
        </Group>

        <Card withBorder shadow="sm" mt="xl" padding="lg">
          <Text size="md" mb="md">
            Para consultar, ingresa tu número de documento
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
