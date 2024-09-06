import { Table, Pagination, Group, Box, Select, TextInput, Button, Grid, Modal, ActionIcon, Flex, Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useMemo } from 'react';
import { BiEdit, BiTrash } from 'react-icons/bi';
import '../../styles.module.css';

import { fetchFilteredGlobal, addAttendee, updateAttendee, deleteAttendee } from '~/api';

interface EventProperty {
  label: string;
  name: string;
  mandatory: boolean;
}

interface EventData {
  _id: string;
  name: string;
  organization: string;
  userProperties: Record<string, unknown>;
  styles: {
    eventImage: string;
  };
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; user?: EventUser }>({
    isOpen: false,
    mode: 'add',
  });
  const [newUserData, setNewUserData] = useState<{ [key: string]: string }>({});
  const [editingUserData, setEditingUserData] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    if (eventId) {
      getEventProperties();
      getEventUsersData();
    }
  }, [eventId]);

  const getEventUsersData = async () => {
    setLoading(true);
    try {
      const filters = { event: eventId };
      const response = await fetchFilteredGlobal('Attendee', filters);
      setAllData(response);
    } finally {
      setLoading(false);
    }
  };

  const getEventProperties = async () => {
    setLoading(true);
    try {
      const response = await fetchFilteredGlobal('Event', { _id: eventId });
      const result = response[0];
      if (result) {
        setEvent(result);
        filterHeadTable(result.userProperties);
      }
    } catch (error) {
      console.error('Error fetching event properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHeadTable = (userProperties: EventProperty[]) => {
    if (!userProperties || !Array.isArray(userProperties)) {
      return;
    }
    const headers = userProperties.map((property) => ({
      label: property.label,
      name: property.name,
      mandatory: property.mandatory,
    }));
    setPropertyHeadersApi(headers);
  };

  const filteredData = useMemo(() => {
    return allData.filter((item) =>
      propertyHeadersApi.some(
        (header) => item.properties[header.name]?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [allData, debouncedSearchTerm, propertyHeadersApi]);

  useEffect(() => {
    setDisplayedData(paginateData(filteredData, page, perPage));
  }, [filteredData, page, perPage]);

  const paginateData = (data: EventUser[], page: number, perPage: number) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return data.slice(start, end);
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

  const handleAddUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await addAttendee({ properties: newUserData, eventId, organization: event?.organization });
      await getEventUsersData();
      setModalState({ isOpen: false, mode: 'add' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = { properties: editingUserData };
      await updateAttendee(modalState.user?._id || '', updatedData);
      await getEventUsersData(); // Refrescar la lista de asistentes después de editar
      setModalState({ isOpen: false, mode: 'edit' });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteAttendee(userId);
      await getEventUsersData(); // Refrescar la lista después de la eliminación
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditInputChange = (name: string, value: string) => {
    setEditingUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openModal = (mode: 'add' | 'edit', user?: EventUser) => {
    if (mode === 'edit' && user) {
      setEditingUserData(
        propertyHeadersApi.reduce(
          (acc, header) => ({
            ...acc,
            [header.name]: String(user.properties[header.name] || ''),
          }),
          {}
        )
      );
    }
    setModalState({ isOpen: true, mode, user });
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
                <Button fullWidth onClick={() => openModal('add')}>
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
                    <Table.Td key={`${item._id}-${header.name}`}>{String(item.properties[header.name] || '')}</Table.Td>
                  ))}
                  <Table.Td>
                    <Group>
                      <Flex>
                        <ActionIcon onClick={() => openModal('edit', item)} mr="xs">
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
            <Pagination value={page} onChange={setPage} total={Math.ceil(filteredData.length / perPage)} />
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

      <Modal
        opened={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'add' })}
        title={modalState.mode === 'add' ? 'Añadir Usuario' : 'Editar Usuario'}
      >
        {modalState.mode === 'add' ? (
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
            <Button variant="white" onClick={() => handleInputChange('email', generateUniqueEmail(newUserData['names'] || ''))}>
              Generar Correo Único
            </Button>
            <Group justify="flex-end" mt="md">
              <Button type="submit">Guardar</Button>
            </Group>
          </form>
        ) : (
          <form onSubmit={handleUpdateUser}>
            {propertyHeadersApi.map((header) => (
              <TextInput
                key={header.name}
                label={header.label}
                value={editingUserData[header.name] || ''}
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
