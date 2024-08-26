import { Table, Pagination, Group, Box, Select, TextInput, Button, Grid, Modal, ActionIcon, Flex, Loader } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import '../styles.module.css';
import { BiEdit, BiTrash } from 'react-icons/bi';

import { fetchEventProperties, fetchEventUsersData, postEventUser, updateEventUser, deleteEventUser } from '~/api';

interface EventProperty {
  label: string;
  name: string;
  mandatory: boolean;
}

interface EventUser {
  _id: string;
  properties: {
    [key: string]: unknown;
  };
}

const DataTable: React.FC = () => {
  const [allData, setAllData] = useState<EventUser[]>([]);
  const [displayedData, setDisplayedData] = useState<EventUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [propertyHeadersApi, setPropertyHeadersApi] = useState<EventProperty[]>([]);
  const [filters] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpened, setModalOpened] = useState(false);
  const [newUserData, setNewUserData] = useState<{ [key: string]: string }>({});
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingUserData, setEditingUserData] = useState<EventUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getEventProperties();
  }, []);

  useEffect(() => {
    getEventUsersData();
  }, [filters]);

  const getEventUsersData = async () => {
    setLoading(true);
    try {
      const response = await fetchEventUsersData();
      const result = await response;
      setAllData(result.data);
      updateDisplayedData(result.data, page, perPage, filters);
    } finally {
      setLoading(false);
    }
  };

  const getEventProperties = async () => {
    setLoading(true);
    try {
      const response = await fetchEventProperties();
      const result = await response;
      if (result) {
        filterHeadTable(result);
      }
    } catch (error) {
      console.error('Error fetching event properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateDisplayedData(allData, page, perPage, filters);
  }, [page, perPage, filters, allData, searchTerm]);

  const filterHeadTable = (userProperties: EventProperty[]) => {
    if (!userProperties || !Array.isArray(userProperties)) {
      console.error('userProperties is undefined or not an array:', userProperties);
      return;
    }
    const headers = (userProperties as EventProperty[]).map((property) => ({
      label: property.label,
      name: property.name,
      mandatory: property.mandatory,
    }));
    setPropertyHeadersApi(headers);
  };

  const updateDisplayedData = (data: EventUser[], page: number, perPage: number, filters: { [key: string]: string }) => {
    const filteredData = data
      .filter((item) => Object.keys(filters).every((key) => item.properties[key]?.toString().includes(filters[key])))
      .filter((item) =>
        propertyHeadersApi.some(
          (header) => item.properties[header.name]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    const start = (page - 1) * perPage;
    const end = start + perPage;
    setDisplayedData(filteredData.slice(start, end));
  };
  const handlePerPageChange = (value: string | null) => {
    if (value !== null) {
      setPerPage(parseInt(value, 10));
      setPage(1);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = event.currentTarget.value.replace(/[.,]/g, ''); // Eliminar puntos y comas
    setSearchTerm(cleanedValue);
  };

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await postEventUser(newUserData);
      getEventUsersData();
      setModalOpened(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateUser = async (evenUserId: string, userData: { [key: string]: unknown }, event: React.FormEvent) => {
    event.preventDefault();
    const eventId = '66c50f374954890f9a07c832'; // Reemplaza con el ID del evento si es necesario

    try {
      // Envolver los datos del usuario en un objeto properties
      const updatedData = {
        properties: userData,
        rol_id: '5afaf644500a7104f77189cd',
      };

      const updatedUser = await updateEventUser(eventId, evenUserId, updatedData);

      // Actualiza el estado con la información actualizada del usuario
      setAllData((prevData) =>
        prevData.map((user) => (user._id === evenUserId ? { ...user, properties: updatedUser.properties } : user))
      );
      updateDisplayedData(allData, page, perPage, filters);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleDeleteUser = async (evenUserId: string) => {
    const eventId = '66c50f374954890f9a07c832'; // Reemplaza con el ID del evento si es necesario

    try {
      await deleteEventUser(eventId, evenUserId);

      // Actualizar la lista de usuarios después de la eliminación
      setAllData((prevData) => prevData.filter((user) => user._id !== evenUserId));
      updateDisplayedData(allData, page, perPage, filters);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openEditModal = (user: EventUser) => {
    setEditingUserData(user);
    setEditModalOpened(true);
  };

  const handleEditInputChange = (name: string, value: string) => {
    if (editingUserData) {
      setEditingUserData((prevData) => ({
        ...prevData!,
        properties: {
          ...prevData!.properties,
          [name]: value,
        },
      }));
    }
  };

  const handleSaveEdit = (event: React.FormEvent) => {
    if (editingUserData) {
      handleUpdateUser(editingUserData._id, editingUserData.properties, event);
      setEditModalOpened(false);
    }
  };

  const generateUniqueEmail = (fullName: string) => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const namePart = fullName
      .toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z.]/g, '');
    return `${namePart}.${randomString}@geniality.com.co`;
  };

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      {loading ? (
        <Loader size="xl" />
      ) : (
        <Box fs={{ overflowX: 'auto', minWidth: '100%', marginTop: '1rem' }}>
          <Box>
            <Grid align="center" gutter="sm" my="sm">
              <Grid.Col span={8}>
                <TextInput placeholder="Buscar usuario" value={searchTerm} onChange={handleSearchChange} fs={{ width: '100%' }} />
              </Grid.Col>
              <Grid.Col span={4}>
                <Button fullWidth onClick={() => setModalOpened(true)}>
                  Añadir
                </Button>
              </Grid.Col>
            </Grid>
          </Box>
          <Table c="white" withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                {propertyHeadersApi.map((header) => (
                  <Table.Th style={{ color: 'white' }} key={header.name}>
                    {header.label}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {displayedData.map((item) => (
                <Table.Tr key={item._id}>
                  {propertyHeadersApi.map((header) => (
                    <Table.Td key={header.name}>{String(item.properties[header.name])}</Table.Td>
                  ))}
                  <Table.Td>
                    <Group>
                      <Flex>
                        <ActionIcon onClick={() => openEditModal(item)} mr="xs">
                          <BiEdit />
                        </ActionIcon>
                        <ActionIcon color="red" onClick={() => handleDeleteUser(item._id)}>
                          <BiTrash />
                        </ActionIcon>
                      </Flex>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group my="md" justify="flex-start" grow align="center">
            <Pagination value={page} onChange={setPage} total={Math.ceil(allData.length / perPage)} />
            <Select
              value={perPage.toString()}
              onChange={handlePerPageChange}
              data={['10', '20', '50', '100']}
              placeholder="Items per page"
              fs={{ width: '100%' }}
            />
          </Group>
        </Box>
      )}

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Añadir Usuario">
        <form onSubmit={handleAddUser}>
          {propertyHeadersApi.map((header) => (
            <TextInput
              key={header.name}
              label={header.label}
              value={newUserData[header.name] || ''}
              onChange={(e) => handleInputChange(header.name, e.target.value)}
              required={header.mandatory}
            />
          ))}

          <Button
            variant="white"
            onClick={() => {
              const generatedEmail = generateUniqueEmail(newUserData['names'] || '');
              handleInputChange('email', generatedEmail);
            }}
          >
            Generar Correo Único
          </Button>

          <Group justify="flex-end" mt="md">
            <Button type="submit">Guardar</Button>
          </Group>
        </form>
      </Modal>

      <Modal opened={editModalOpened} onClose={() => setEditModalOpened(false)} title="Editar Usuario">
        {editingUserData && (
          <form onSubmit={handleSaveEdit}>
            {propertyHeadersApi.map((header) => (
              <TextInput
                key={header.name}
                label={header.label}
                value={String(editingUserData.properties[header.name] || '')}
                onChange={(e) => handleEditInputChange(header.name, e.target.value)}
                required={header.mandatory}
              />
            ))}
            <Group justify="flex-end" mt="md">
              <Button type="submit">Guardar Cambios</Button>
            </Group>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default DataTable;
