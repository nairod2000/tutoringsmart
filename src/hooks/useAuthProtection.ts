// useAuthProtection.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';

const useAuthProtection = () => {
  const { isAuthenticated, authChecked } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated) {
      router.push('/signin');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, authChecked, router]);

  return loading;
};

export default useAuthProtection;
