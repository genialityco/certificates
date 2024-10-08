import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { fetchFilteredGlobal } from '~/api';
import useActionMode from '~/store/useActionMode';
import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';
import useUserMode from '~/store/useUserMode';
import theme from '~/theme';

import ActionsControl from './controls/ActionsControl';
import AlignControl from './controls/AlignControl';
import AttributeControl from './controls/AttributeControl';
import BackgroundControl from './controls/BackgroundControl';
import BorderRadiusControl from './controls/BorderRadiusControl';
import FrameControl from './controls/FrameControl';
import IconControl from './controls/IconControl';
import ImageControl from './controls/ImageControl';
import LayerControl from './controls/LayerControl';
import OpacityControl from './controls/OpacityControl';
import StrokeColorControl from './controls/StrokeColorControl';
import StrokeWidthControl from './controls/StrokeWidthControl';
import TextControl from './controls/TextControl';

interface Property {
  name: string;
  label: string;
}

const Aside = styled.aside`
  pointer-events: auto;
  background: var(--color-bgPrimary);
  border: 1px solid var(--color-borderPrimary);
  border-radius: 5px;
  padding: ${theme.variables.sidebarGutter};
  max-height: 270px;
  overflow-y: auto;

  ${theme.medias.gteSmall} {
    max-height: calc(100vh - ${theme.variables.topNavbarHeight} - ${theme.variables.overlayGutter} * 3);
  }
`;

export default function OverlaySidebar({ eventId }: { eventId: string }) {
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const activeObjectId = useActiveObjectId((state) => state.activeObjectId);

  const userMode = useUserMode((state) => state.userMode);

  const actionMode = useActionMode((state) => state.actionMode);

  const canvasObjects = useCanvasObjects((state) => state.canvasObjects);

  const activeObject = canvasObjects.find((object) => object.id === activeObjectId);

  const updateCanvasObject = useCanvasObjects((state) => state.updateCanvasObject);

  useEffect(() => {
    const fetchEventProperties = async () => {
      const filters = { _id: eventId };
      const data = await fetchFilteredGlobal('Event', filters);
      if (data[0] && data[0].userProperties) {
        setUserProperties(data[0].userProperties);
      }
    };

    fetchEventProperties();
  }, [eventId]);

  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedText = e.target.value;
    setSelectedProperty(selectedText);

    // Asigna el valor al objeto attribute
    if (activeObject) {
      updateCanvasObject(activeObject.id, { text: selectedText });
    }
  };

  const activeNodes: Record<string, boolean> = {
    icons: userMode === 'icon',
    images: userMode === 'image',
    frame: !!activeObject,
    align: !!activeObject,
    backgroundColor: activeObject?.type === 'rectangle' || activeObject?.type === 'ellipse' || activeObject?.type === 'icon',
    strokeWidth: !!activeObject && activeObject.type !== 'text' && activeObject.type !== 'icon' && activeObject.type !== 'image',
    strokeColor:
      !!activeObject &&
      activeObject.type !== 'text' &&
      activeObject.type !== 'icon' &&
      activeObject.type !== 'image' &&
      (activeObject?.strokeWidth || 0) > 0,
    borderRadius: activeObject?.type === 'rectangle',
    text: activeObject?.type === 'text',
    opacity: !!activeObject,
    layer: !!activeObject,
    actions: !!activeObject,
  };

  const hasActiveNodes = Object.values(activeNodes).some((value) => value);

  if (!hasActiveNodes || actionMode?.type === 'isDrawing') {
    return null;
  }

  return (
    <Aside>
      <div>
        {activeNodes.frame && <FrameControl />}
        {activeNodes.images && <ImageControl />}
        {activeNodes.icons && <IconControl />}
        {activeNodes.backgroundColor && <BackgroundControl />}
        {activeNodes.strokeWidth && <StrokeWidthControl />}
        {activeObject?.type === 'attribute' && <AttributeControl />}
        {activeObject?.type === 'attribute' && (
          <div>
            <label htmlFor="propertySelect">Selecciona una propiedad:</label>
            <select id="propertySelect" onChange={handlePropertyChange} value={selectedProperty}>
              <option value="" disabled>
                Seleccione una propiedad
              </option>
              {userProperties.map((property, index) => (
                <option key={index} value={property.name}>
                  {property.label}
                </option>
              ))}
            </select>
          </div>
        )}
        {activeNodes.strokeColor && <StrokeColorControl />}
        {activeNodes.borderRadius && <BorderRadiusControl />}
        {activeNodes.text && <TextControl />}
        {activeNodes.opacity && <OpacityControl />}
        {activeNodes.align && <AlignControl />}
        {activeNodes.layer && <LayerControl />}
        {activeNodes.actions && <ActionsControl />}
      </div>
    </Aside>
  );
}
