import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Canvas from '~/components/Canvas';
import CanvasEventListeners from '~/components/CanvasEventListeners';
import Overlay from '~/components/Overlay';

export default function AppLayout() {
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    const html = document.querySelector('html');

    if (html) {
      html.style.overflow = 'hidden';
    }

    return () => {
      if (html) {
        html.style.overflow = 'auto';
      }
    };
  }, []);

  return (
    <>
      <Overlay eventId={eventId ? String(eventId) : ''} />
      <Canvas eventId={eventId ? String(eventId) : ''} />
      <CanvasEventListeners />
    </>
  );
}
