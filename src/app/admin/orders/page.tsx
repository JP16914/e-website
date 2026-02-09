import AdminOrdersPage from './AdminOrdersPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminOrdersPage />
    </Suspense>
  );
}
