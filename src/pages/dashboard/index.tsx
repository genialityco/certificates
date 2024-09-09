import {
  Container,
  Group,
  Card,
  Text,
  SimpleGrid,
  Button,
  Modal,
  TextInput,
  Checkbox,
  ActionIcon,
  Divider,
  Stack,
  Flex,
  Box,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { TbTrash } from 'react-icons/tb';

import { createEvent, fetchAllsEvents, deleteEvent, fetchFilteredGlobal } from '~/api';

interface UserProperty {
  label: string;
  name: string;
  type: string;
  mandatory: boolean;
}

interface Event {
  _id: string;
  name: string;
  organization: { $oid: string };
  userProperties: UserProperty[];
}

interface Certificate {
  _id: string;
  elements: Array<unknown>;
  event: string;
  // Otros campos relevantes del certificado
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [certificates, setCertificates] = useState<Record<string, Certificate | null>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inicializar userProperties por defecto
  const defaultUserProperties: UserProperty[] = [
    { label: 'Numero Documento', name: 'numeroDocumento', type: 'text', mandatory: true },
    { label: 'Nombres Y Apellidos', name: 'names', type: 'text', mandatory: true },
    { label: 'Número de teléfono', name: 'numeroDeTelefono', type: 'text', mandatory: false },
    { label: 'Correo', name: 'email', type: 'email', mandatory: true },
  ];

  const [newEvent, setNewEvent] = useState({
    name: '',
    organization: '66d716d965613bac834484dd',
    userProperties: defaultUserProperties,
  });

  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetchAllsEvents();
    setEvents(response);
    response.forEach((event: Event) => {
      checkCertificate(event._id);
    });
  };

  const checkCertificate = async (eventId: string) => {
    const filters = { event: eventId };
    const result = await fetchFilteredGlobal('Certificate', filters);
    if (result && result.length > 0) {
      setCertificates((prevCertificates) => ({
        ...prevCertificates,
        [eventId]: result[0],
      }));
    } else {
      setCertificates((prevCertificates) => ({
        ...prevCertificates,
        [eventId]: null,
      }));
    }
  };

  const handleCreateCertificate = async () => {
    try {
      await createEvent(newEvent);
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creando evento:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      fetchEvents();
    } catch (error) {
      console.error('Error eliminando el evento:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value,
    }));
  };

  const handleUserPropertyChange = (index: number, field: string, value: string | boolean) => {
    const updatedUserProperties = [...newEvent.userProperties];
    updatedUserProperties[index] = {
      ...updatedUserProperties[index],
      [field]: value,
    };
    setNewEvent({ ...newEvent, userProperties: updatedUserProperties });
  };

  const handleLabelChange = (index: number, value: string) => {
    const updatedUserProperties = [...newEvent.userProperties];

    updatedUserProperties[index].label = value;
    updatedUserProperties[index].name = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '')
      .replace(/[^\w]/g, '');

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      userProperties: updatedUserProperties,
    }));
  };

  const handleAddUserProperty = () => {
    const newProperty: UserProperty = {
      label: '',
      name: '',
      type: 'text',
      mandatory: false,
    };
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      userProperties: [...prevEvent.userProperties, newProperty],
    }));
  };

  const handleRemoveUserProperty = (index: number) => {
    const updatedUserProperties = newEvent.userProperties.filter((_, i) => i !== index);
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      userProperties: updatedUserProperties,
    }));
  };

  return (
    <Container>
      <Group justify="space-between" mt="md">
        <h1 style={{ color: 'white' }}>Administrar certificados</h1>
        <Button onClick={() => setIsModalOpen(true)} leftSection={<BiPlus size={16} />}>
          Crear nuevo certificado
        </Button>
      </Group>

      <SimpleGrid cols={3} spacing="md" mt="md">
        {events.map((event) => (
          <Card key={event._id} shadow="sm" padding="lg" style={{ position: 'relative' }}>
            <Text size="lg">{event.name}</Text>
            <Button mt="md" fullWidth onClick={() => router.push(`/event/${event._id}`)}>
              Ir a la landing
            </Button>
            {certificates[event._id] ? (
              <Button
                mt="md"
                fullWidth
                onClick={() => router.push(`/event/${event._id}/design?certificateId=${certificates[event._id]?._id}`)}
              >
                Editar certificado
              </Button>
            ) : (
              <Button mt="md" fullWidth onClick={() => router.push(`/event/${event._id}/design`)}>
                Crear certificado
              </Button>
            )}
            <Button mt="md" fullWidth onClick={() => router.push(`/event/${event._id}/manage-users`)}>
              Gestionar usuarios
            </Button>
            <ActionIcon
              c="red"
              variant="white"
              size="lg"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
              onClick={() => handleDeleteEvent(event._id)}
            >
              <TbTrash size={18} />
            </ActionIcon>
          </Card>
        ))}
      </SimpleGrid>

      {/* Modal para crear un nuevo certificado */}
      <Modal opened={isModalOpen} size="lg" onClose={() => setIsModalOpen(false)} title="Crear nuevo certificado">
        <Stack m="lg">
          <TextInput
            label="Nombre del certificado"
            placeholder="Certificado laboral, asistencia, etc."
            value={newEvent.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />

          <Divider label="Propiedades de usuario" />

          {newEvent.userProperties.map((property, index) => (
            <Flex key={index} gap="md" justify="space-between" align="center" wrap="nowrap">
              <Box style={{ flex: 3 }}>
                <TextInput
                  label="Label"
                  placeholder="Ej: Código Postal"
                  value={property.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  withAsterisk
                />
              </Box>
              <Box style={{ flex: 3 }}>
                <TextInput label="Name" placeholder="Nombre autogenerado" value={property.name} disabled />
              </Box>
              <Box style={{ flex: 1 }}>
                <Checkbox
                  label="Obligatorio"
                  checked={property.mandatory}
                  onChange={(e) => handleUserPropertyChange(index, 'mandatory', e.currentTarget.checked)}
                />
              </Box>
              <Box style={{ flex: 'none' }}>
                <ActionIcon c="red" variant="light" onClick={() => handleRemoveUserProperty(index)}>
                  <TbTrash size={18} />
                </ActionIcon>
              </Box>
            </Flex>
          ))}

          <Button onClick={handleAddUserProperty} leftSection={<BiPlus size={16} />} fullWidth variant="outline">
            Añadir nueva propiedad
          </Button>

          <Group justify="flex-start" mt="md">
            <Button onClick={handleCreateCertificate}>Crear certificado</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
