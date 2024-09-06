import { useRouter } from 'next/router';
import React from 'react';

import PageSEO from '~/components/PageSEO';
import AppLayout from '~/layouts/AppLayout';

export default function DesignPage() {
  const router = useRouter();
  const { eventId } = router.query;

  return (
    <>
      <PageSEO />
      <AppLayout />
    </>
  );
}
