import { Slider, NativeSelect,Button, Tooltip } from '@mantine/core';
import React, { type ReactNode } from 'react';
import { FaBold, FaItalic, FaSortAmountUp } from 'react-icons/fa';
import styled from 'styled-components';

import ControlHeader from '../components/ControlHeader';

import ColorPicker from '~/components/ColorPicker/ColorPicker';
import useActiveObjectId from '~/store/useActiveObjectId';
import useAvailableFonts from '~/store/useAvailableFonts';
import useCanvasObjects from '~/store/useCanvasObjects';
import useDefaultParams from '~/store/useDefaultParams';
import theme from '~/theme';

const TextParamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-gap: ${theme.variables.sidebarGutter};
`;

export default function AttributeControl() {
  const activeObjectId = useActiveObjectId((state) => state.activeObjectId);

  const setDefaultParams = useDefaultParams((state) => state.setDefaultParams);

  const availableFonts = useAvailableFonts((state) => state.availableFonts);

  const canvasObjects = useCanvasObjects((state) => state.canvasObjects);
  const updateCanvasObject = useCanvasObjects((state) => state.updateCanvasObject);

  const activeObject = canvasObjects.find((object) => object.id === activeObjectId);

  if (!activeObject) {
    return null;
  }


  const fontStyleOptions: {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    isActive: boolean;
  }[] = activeObject
    ? [
        {
          label: 'Bold',
          icon: <FaBold />,
          onClick: () => {
            updateCanvasObject(activeObject.id, {
              fontWeight: activeObject.fontWeight === 'normal' ? 'bold' : 'normal',
            });
          },
          isActive: activeObject.fontWeight === 'bold',
        },
        {
          label: 'Italic',
          icon: <FaItalic />,
          onClick: () => {
            updateCanvasObject(activeObject.id, {
              fontStyle: activeObject.fontStyle === 'normal' ? 'italic' : 'normal',
            });
          },
          isActive: activeObject.fontStyle === 'italic',
        },
        {
          label: 'Small Caps',
          icon: <FaSortAmountUp />,
          onClick: () => {
            updateCanvasObject(activeObject.id, {
              fontVariant: activeObject.fontVariant === 'normal' ? 'small-caps' : 'normal',
            });
          },
          isActive: activeObject.fontVariant === 'small-caps',
        },
      ]
    : [];

  return (
    <>
      <ControlHeader title="Font Family" />
      <NativeSelect
        key={`font-family-select-${activeObject.id}`}
        size="xs"
        data={[
          { value: 'font-family-select-generic', label: 'Generic', disabled: true },
          { value: 'cursive', label: 'Cursive' },
          { value: 'fantasy', label: 'Fantasy' },
          { value: 'monospace', label: 'Monospace' },
          { value: 'sans-serif', label: 'Sans-serif' },
          { value: 'serif', label: 'Serif' },
          { value: 'font-family-select-specific', label: 'Specific', disabled: true },
          ...availableFonts.map((fontFamily) => ({
            value: fontFamily,
            label: fontFamily,
          })),
        ]}
        value={activeObject.fontFamily}
        onChange={(event) => {
          updateCanvasObject(activeObject.id, {
            fontFamily: event.target.value,
          });
        }}
      />
      <ControlHeader title="Font Color" />
      <ColorPicker
        key={`font-color-picker-${activeObject.id}`}
        color={activeObject.fontColorHex}
        onChange={(color) => {
          updateCanvasObject(activeObject.id, {
            fontColorHex: color,
          });
          setDefaultParams({
            fontColorHex: color,
          });
        }}
      />
      <ControlHeader title="Font Style" />
      <TextParamsGrid>
        {fontStyleOptions.map(({ label, icon, onClick, isActive }) => (
          <Tooltip key={label} label={label} position="top">
            <Button variant={isActive ? 'outline' : 'default'} color="dark" size="xs" onClick={onClick}>
              {icon}
            </Button>
          </Tooltip>
        ))}
      </TextParamsGrid>
      <ControlHeader title="Font Size" />
      <Slider
        key={`font-size-slider-${activeObject.id}`}
        size="sm"
        min={1}
        max={400}
        value={activeObject.fontSize}
        onChange={(value) => {
          updateCanvasObject(activeObject.id, {
            fontSize: value,
          });
        }}
        label={(value) => `${value} px`}
      />
      <ControlHeader title="Line Height" />
      <Slider
        key={`font-line-height-slider-${activeObject.id}`}
        size="sm"
        min={0.5}
        max={2.5}
        step={0.1}
        value={activeObject.fontLineHeightRatio}
        onChange={(value) => {
          updateCanvasObject(activeObject.id, {
            fontLineHeightRatio: value,
          });
        }}
        label={(value) => value.toFixed(1)}
      />
    </>
  );
}
