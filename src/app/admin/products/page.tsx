import AdminProductsPage from './AdminProductsPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminProductsPage />
    </Suspense>
  );
}
