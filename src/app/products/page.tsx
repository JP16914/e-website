import ProductsListPage from './ProductsListPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsListPage />
    </Suspense>
  );
}
