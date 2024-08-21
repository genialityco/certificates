import { Table, Pagination, Group, Box, Select, TextInput, Button, Grid, Col } from '@mantine/core';
import React, { useState, useEffect } from 'react';

import '../styles.module.css';
import { fetchEventProperties, fetchEventUsersData } from '~/api';

interface EventProperty {
  label: string;
  name: string;
}

interface EventUser {
  _id: string;
  properties: {
    [key: string]: any;
  };
}

const DataTable: React.FC = () => {
  const [allData, setAllData] = useState<EventUser[]>([]);
  const [displayedData, setDisplayedData] = useState<EventUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [propertyHeadersApi, setPropertyHeadersApi] = useState<EventProperty[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const getEventUsersData = async () => {
      const response = await fetchEventUsersData();
      const result = await response;
      setAllData(result.data);
      updateDisplayedData(result.data, page, perPage, filters);
    };

    getEventUsersData();
  }, [page, perPage, filters]);

  useEffect(() => {
    const getEventProperties = async () => {
      try {
        const response = await fetchEventProperties();
        const result = await response;
        if (result) {
          filterHeadTable(result);
        }
      } catch (error) {
        console.error('Error fetching event properties:', error);
      }
    };

    getEventProperties();
  }, []);

  useEffect(() => {
    updateDisplayedData(allData, page, perPage, filters);
  }, [page, perPage, filters, allData, searchTerm]);

  const filterHeadTable = (userProperties: unknown) => {
    if (!userProperties || !Array.isArray(userProperties)) {
      console.error('userProperties is undefined or not an array:', userProperties);
      return;
    }

    const headers = (userProperties as EventProperty[]).map((property) => ({
      label: property.label,
      name: property.name,
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
    setSearchTerm(event.currentTarget.value);
  };

  return (
    <Box p="sm">
      <Grid align="center" gutter="sm">
        <Col span={12} md={9}>
          <TextInput placeholder="Buscar usuario" value={searchTerm} onChange={handleSearchChange} sx={{ width: '100%' }} />
        </Col>
        <Col span={12} md={3}>
          <Button fullWidth>Añadir</Button>
        </Col>
      </Grid>
      <Box sx={{ overflowX: 'auto', minWidth: 500, marginTop: '1rem' }}>
        <Table c="white" highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              {propertyHeadersApi.map((header) => (
                <th style={{ color: 'white' }} key={header.name}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item) => (
              <tr key={item._id}>
                {propertyHeadersApi.map((header) => (
                  <td key={header.name}>{item.properties[header.name]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
      <Group mt="md" position="apart" grow>
        <Pagination value={page} onChange={setPage} total={Math.ceil(allData.length / perPage)} />
        <Select
          value={perPage.toString()}
          onChange={handlePerPageChange}
          data={['10', '20', '50', '100']}
          placeholder="Items per page"
        />
      </Group>
    </Box>
  );
};

export default DataTable;
