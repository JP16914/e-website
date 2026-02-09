import OrderSuccessPage from './OrderSuccessPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessPage />
    </Suspense>
  );
}
