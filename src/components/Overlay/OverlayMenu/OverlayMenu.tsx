import { ActionIcon, Menu, Tooltip } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import { BiEdit } from 'react-icons/bi';
import { FaBars } from 'react-icons/fa';
import { GrUserSettings } from 'react-icons/gr';
import styled from 'styled-components';

import { menuTabsDefinition } from './menuTabsDefinition';

import useModalContext from '~/context/useModalContext';
import useActiveObjectId from '~/store/useActiveObjectId';


const WrapperDiv = styled.div`
  pointer-events: auto;
`;

export default function OverlayMenu() {
  const { openMenuModal } = useModalContext();
  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);
  const router = useRouter();

  const handleManageUsersClick = () => {
    router.push('/dashboard');
  };

  const handleEditClick = () => {
    router.push('/admin');
  };

  return (
    <WrapperDiv>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Tooltip position="bottom-end" label="Open menu" offset={16}>
            <ActionIcon title="Settings" variant="default" size="xl">
              <FaBars />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu trigger="hover" shadow="md" width={200} position="left">
            <Menu.Target>
              <Menu.Item leftSection={<BiEdit />}>Editar certificado</Menu.Item>
            </Menu.Target>
            <Menu.Dropdown>
              {menuTabsDefinition.map((tab) => (
                <Menu.Item
                  key={tab.id}
                  leftSection={tab.icon}
                  onClick={() => {
                    setActiveObjectId(null);
                    handleEditClick();
                    openMenuModal(tab.id);
                  }}
                >
                  {tab.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <Menu.Divider />
          <Menu.Item leftSection={<GrUserSettings />} onClick={handleManageUsersClick}>
            Gestionar usuarios
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </WrapperDiv>
  );
}
