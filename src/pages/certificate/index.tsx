import { Button } from '@mantine/core';
import jsPDF from 'jspdf';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import { FaDownload } from 'react-icons/fa';

import { fetchFilteredGlobal } from '~/api';
import CanvasPreview from '~/components/CanvasPreview';
import { CANVAS_PREVIEW_UNIQUE_ID } from '~/config/globalElementIds';
import { CanvasObject } from '~/config/types';
import useCanvasObjects from '~/store/useCanvasObjects';
import generateUniqueId from '~/utils/generateUniqueId';
import getImageElementFromUrl from '~/utils/getImageElementFromUrl';

// Tipos para el esquema de Attendee y Certificate
interface Attendee {
  _id: string;
  event: string;
  organization?: string;
  properties: Record<string, unknown>;
}

interface Certificate {
  elements: CanvasObject[];
  event: string;
  createdAt: string;
}

export default function Certificado() {
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [certificateElements, setCertificateElements] = useState<CanvasObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { attendeeId, eventId } = router.query;

  const appendAttributeObject = useCanvasObjects((state) => state.appendAttributeObject);
  const appendImageObject = useCanvasObjects((state) => state.appendImageObject);

  // Obtener datos del usuario y del certificado
  useEffect(() => {
    const fetchUserCertificates = async () => {
      setLoading(true);
      try {
        const filters = { _id: attendeeId };
        const [user] = (await fetchFilteredGlobal('Attendee', filters)) as Attendee[];
        if (!user) {
          alert('No existen certificados para este documento.');
          return;
        }
        setAttendee(user);

        const [certificate] = (await fetchFilteredGlobal('Certificate', { event: eventId })) as Certificate[];
        setCertificateElements(certificate?.elements || []);
      } catch (error) {
        console.error('Error fetching user certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    if (attendeeId && eventId) {
      fetchUserCertificates();
    }
  }, [attendeeId, eventId]);

  // Insertar imagen en el canvas
  const pushImageObject = useCallback(
    async ({ imageUrl, imageElement, element }: { imageUrl: string; imageElement: HTMLImageElement; element: CanvasObject }) => {
      appendImageObject({
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        opacity: 100,
        imageUrl,
        imageElement,
      });
    },
    [appendImageObject]
  );

  // Common image loader and appender
  const commonPushImageObject = useCallback(
    async (element: CanvasObject, url: string) => {
      const imageElement = await getImageElementFromUrl(url);
      await pushImageObject({ imageUrl: url, imageElement, element });
    },
    [pushImageObject]
  );

  // Función para renderizar el certificado
  const handleRenderCertificate = useCallback(async () => {
    for (const element of certificateElements) {
      switch (element.type) {
        case 'text':
          appendAttributeObject({
            id: element.id,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            text: element.text || '',
            opacity: element.opacity || 100,
            fontColorHex: element.fontColorHex || '#000000',
            fontSize: element.fontSize || 16,
            fontFamily: element.fontFamily || 'Arial',
            fontStyle: element.fontStyle || 'normal',
            fontVariant: element.fontVariant || 'normal',
            fontWeight: element.fontWeight || 'normal',
            fontLineHeightRatio: element.fontLineHeightRatio || 1.2,
          });
          break;
        case 'attribute':
          element.text = (attendee?.properties[element.text || ''] as string) || '';
          appendAttributeObject({
            id: element.id,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            text: element.text,
            opacity: element.opacity || 100,
            fontColorHex: element.fontColorHex || '#000000',
            fontSize: element.fontSize || 16,
            fontFamily: element.fontFamily || 'Arial',
            fontStyle: element.fontStyle || 'normal',
            fontVariant: element.fontVariant || 'normal',
            fontWeight: element.fontWeight || 'normal',
            fontLineHeightRatio: element.fontLineHeightRatio || 1.2,
          });
          break;
        case 'image':
          await commonPushImageObject(element, element.imageUrl || '');
          break;
        default:
          break;
      }
    }
  }, [certificateElements, appendAttributeObject, commonPushImageObject, attendee]);

  // Renderizar el certificado al cargar los elementos
  useEffect(() => {
    if (certificateElements.length > 0 && attendeeId && eventId) {
      handleRenderCertificate();
    }
  }, [certificateElements, attendeeId, eventId, handleRenderCertificate]);

  // Descargar el canvas como imagen o PDF
  const downloadCanvas = (type: 'png' | 'jpg' | 'pdf') => {
    const canvas = document.getElementById(CANVAS_PREVIEW_UNIQUE_ID) as HTMLCanvasElement;
    const image = canvas.toDataURL(`image/${type}`);

    if (type === 'pdf') {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(image, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${generateUniqueId()}.pdf`);
    } else {
      const link = document.createElement('a');
      link.download = `${generateUniqueId()}.${type}`;
      link.href = image;
      link.click();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'white', marginTop: '50px' }}>Descarga tu certificado</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBlock: '1rem' }}>
        {['png', 'jpg', 'pdf'].map((format) => (
          <Button
            key={format}
            size="xs"
            variant="default"
            onClick={() => downloadCanvas(format as 'png' | 'jpg' | 'pdf')}
            leftSection={<FaDownload />}
          >
            {format.toUpperCase()}
          </Button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '80%',
          margin: '0 auto',
          paddingBottom: '15px',
        }}
      >
        {!loading && <CanvasPreview />}
      </div>
    </div>
  );
}
