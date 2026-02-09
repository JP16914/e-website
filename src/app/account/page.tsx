import AccountInfoPage from './AccountInfoPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountInfoPage />
    </Suspense>
  );
}
