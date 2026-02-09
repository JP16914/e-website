import SignUpPage from './SignUpPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpPage />
    </Suspense>
  );
}
