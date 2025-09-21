"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';

export default function HomePage() {
  const router = useRouter();
  const { isLoaded, mode } = useAppContext();

  useEffect(() => {
    if (isLoaded) {
      if (mode) {
        router.replace('/dashboard');
      } else {
        router.replace('/select-role');
      }
    }
  }, [isLoaded, mode, router]);

  return null;
}
