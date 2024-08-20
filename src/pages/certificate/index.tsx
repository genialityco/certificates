import { Button } from '@mantine/core';
import jsPDF from 'jspdf';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';

import CanvasPreview from '~/components/CanvasPreview';
import { CANVAS_PREVIEW_UNIQUE_ID } from '~/config/globalElementIds';
import useCanvasContext from '~/context/useCanvasContext';
import useCanvasObjects from '~/store/useCanvasObjects';
import generateUniqueId from '~/utils/generateUniqueId';
import getDimensionsFromImage from '~/utils/getDimensionsFromImage';
import getImageElementFromUrl from '~/utils/getImageElementFromUrl';

export default function Certificado() {
  const { contextRef } = useCanvasContext();
  const router = useRouter();
  const { name, documento } = router.query;

  const appendTextObject = useCanvasObjects((state) => state.appendTextObject);
  const appendImageObject = useCanvasObjects((state) => state.appendImageObject);

  const imageUrl = 'https://i.ibb.co/c6Yhnt5/CERTFICADOS-CONGRESO-PH.png';

  const pushImageObject = async ({ imageElement }) => {
    const createdObjectId = generateUniqueId();
    appendImageObject({
      id: createdObjectId,
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      opacity: 100,
      imageUrl,
      imageElement,
    });
  };

  const commonPushImageObject = async (url) => {
    const imageElement = await getImageElementFromUrl(url);
    const dimensions = await getDimensionsFromImage({
      context: contextRef?.current,
      imageObject: { x: 0, y: 0, imageElement },
    });
    pushImageObject({ imageUrl: url, imageElement, dimensions });
  };

  const handleAppendText = async () => {
    await commonPushImageObject(imageUrl);

    const idCertificateName = generateUniqueId();
    const certificateName = name || 'Nombre no disponible';
    appendTextObject({
      id: idCertificateName,
      x: 356,
      y: 339,
      width: 1211,
      height: 100,
      text: certificateName.toUpperCase(),
      textAlignHorizontal: 'center',
      textAlignVertical: 'middle',
      textJustify: false,
      fontColorHex: '#000000',
      fontSize: 44,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontVariant: 'normal',
      fontLineHeightRatio: 1,
      opacity: 100,
    });

    const idCertificateNumber = generateUniqueId();
    const certificateNumber = documento || 'Documento no disponible';
    appendTextObject({
      id: idCertificateNumber,
      x: 669,
      y: 471,
      width: 582,
      height: 100,
      text: certificateNumber.replace(/\d(?=(?:\d{3})+$)/g, '$&.'),
      textAlignHorizontal: 'center',
      textAlignVertical: 'middle',
      textJustify: false,
      fontColorHex: '#000000',
      fontSize: 35,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontVariant: 'normal',
      fontLineHeightRatio: 1,
      opacity: 100,
    });
  };

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
      const a = document.createElement('a');
      a.download = `${generateUniqueId()}.${type}`;
      a.href = image;
      a.click();
      a.remove();
    }
  };

  useEffect(() => {
    if (name && documento) {
      handleAppendText();
    }
  }, [name, documento]);

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBlock: '1rem',
        }}
      >
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('png');
          }}
          leftIcon={<FaDownload />}
        >
          PNG
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('jpg');
          }}
          leftIcon={<FaDownload />}
        >
          JPG
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('pdf');
          }}
          leftIcon={<FaDownload />}
        >
          PDF
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '80%',
          margin: '0 auto',
        }}
      >
        <CanvasPreview />
      </div>
    </div>
  );
}
