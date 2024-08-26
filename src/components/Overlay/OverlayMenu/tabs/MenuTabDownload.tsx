import { Button, Checkbox } from '@mantine/core';
import jsPDF from 'jspdf';
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import styled from 'styled-components';

import CanvasPreview from '~/components/CanvasPreview';
import { CANVAS_PREVIEW_UNIQUE_ID } from '~/config/globalElementIds';
import useCanvasBackgroundColor from '~/store/useCanvasBackgroundColor';
import useCanvasWorkingSize from '~/store/useCanvasWorkingSize';
import useDefaultParams from '~/store/useDefaultParams';
import generateUniqueId from '~/utils/generateUniqueId';

import { H4 } from '../commonTabComponents';

const DownloadButtonsGridDiv = styled.div`
  display: flex;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 0.5rem;
  margin-bottom: 1rem;
`;

export default function MenuTabDownload() {
  const defaultParams = useDefaultParams((state) => state.defaultParams);

  const canvasWorkingSize = useCanvasWorkingSize((state) => state.canvasWorkingSize);

  const canvasBackgroundColor = useCanvasBackgroundColor((state) => state.canvasBackgroundColor);
  const setCanvasBackgroundColor = useCanvasBackgroundColor((state) => state.setCanvasBackgroundColor);

  const downloadCanvas = (type: 'png' | 'jpg' | 'pdf') => {
    const canvas = document.getElementById(CANVAS_PREVIEW_UNIQUE_ID) as HTMLCanvasElement;
    const image = canvas.toDataURL('image/' + type);

    if (type === 'pdf') {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(image, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${generateUniqueId()}.pdf`);
    } else {
      const a = document.createElement('a');
      a.download = `${generateUniqueId()}.${type}`;
      a.href = image;
      a.click();
      a.remove();
    }
  };

  return (
    <>
      <H4>Download</H4>
      <DownloadButtonsGridDiv>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('png');
          }}
          leftSection={<FaDownload />}
        >
          PNG
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('jpg');
          }}
          leftSection={<FaDownload />}
        >
          JPG
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('pdf');
          }}
          leftSection={<FaDownload />}
        >
          PDF
        </Button>
      </DownloadButtonsGridDiv>
      <H4>
        Preview<span>{`${canvasWorkingSize.width} x ${canvasWorkingSize.height} px`}</span>
      </H4>
      <CanvasPreview />
      <Checkbox
        size="sm"
        label="Transparent Background"
        checked={canvasBackgroundColor === 'transparent'}
        onChange={(event) => {
          if (event.target.checked) {
            setCanvasBackgroundColor('transparent');
          } else {
            setCanvasBackgroundColor(defaultParams.canvasBackgroundColor);
          }
        }}
      />
    </>
  );
}
