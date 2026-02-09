import CheckoutPage from './CheckoutPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
