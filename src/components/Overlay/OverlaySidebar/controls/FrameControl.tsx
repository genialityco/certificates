import { NumberInput } from '@mantine/core';
import React from 'react';
import styled from 'styled-components';

import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';
import theme from '~/theme';

import ControlHeader from '../components/ControlHeader';

const FrameGridDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: ${theme.variables.sidebarGutter};
`;

export default function FrameControl() {
  const activeObjectId = useActiveObjectId((state) => state.activeObjectId);

  const canvasObjects = useCanvasObjects((state) => state.canvasObjects);

  const updateCanvasObject = useCanvasObjects((state) => state.updateCanvasObject);

  const activeObject = canvasObjects.find((object) => object.id === activeObjectId);

  const frameOptions: {
    label: string;
    value: number;
    onChange: (value: string | number) => void;
  }[] = activeObject
    ? [
        {
          label: 'X',
          value: activeObject.x,
          onChange: (value: string | number) => {
            const numericValue = Number(value);
            if (Number.isFinite(numericValue)) {
              updateCanvasObject(activeObject.id, { x: numericValue });
            }
          },
        },
        {
          label: 'Y',
          value: activeObject.y,
          onChange: (value: string | number) => {
            const numericValue = Number(value);
            if (Number.isFinite(numericValue)) {
              updateCanvasObject(activeObject.id, { y: numericValue });
            }
          },
        },
        {
          label: 'W',
          value: activeObject.width,
          onChange: (value: string | number) => {
            const numericValue = Number(value);
            if (Number.isFinite(numericValue)) {
              updateCanvasObject(activeObject.id, { width: numericValue });
            }
          },
        },
        {
          label: 'H',
          value: activeObject.height,
          onChange: (value: string | number) => {
            const numericValue = Number(value);
            if (Number.isFinite(numericValue)) {
              updateCanvasObject(activeObject.id, { height: numericValue });
            }
          },
        },
      ]
    : [];

  return (
    <>
      <ControlHeader title="Frame" />
      <FrameGridDiv>
        {frameOptions.map(({ label, value, onChange }) => (
          <NumberInput
            key={label}
            size="xs"
            style={{ width: '100%' }}
            value={Math.trunc(value)}
            onChange={onChange}
            leftSection={<span style={{ fontSize: '12px' }}>{label}</span>}
            hideControls
          />
        ))}
      </FrameGridDiv>
    </>
  );
}
