"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);  // Shtoni një gjendje loading
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log('Token i lexuar nga localStorage:', token); // Debugging step

    // Kontrolloni nëse tokeni është i pranishëm
    if (!token) {
      // Nëse nuk ka token, drejto përdoruesin në login
      router.push('/login');
      return;
    }

    // Pasi kontrollohet tokeni, bëjmë loading false
    setLoading(false);

    // Fetch për të dhënat nëse tokeni është valid
    // Pjesa tjetër mund të jetë si ishte më parë, për të marrë të dhëna
    // const fetchData = async () => {
    //   try {
    //     const res = await authAxiosInstance('/protected/data');  // Kërkesa për të dhëna
    //     setData(res.data);  // Ruaj të dhënat e marra
    //   } catch (err) {
    //     console.error('Gabim gjatë marrjes së të dhënave:', err);
    //     router.push('/login');  // Nëse ka gabim, drejto në login
    //   }
    // };

    // fetchData(); // Thirrja e fetchData() është komentuese për momentin

  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Shfaq loading derisa të kontrollohet tokeni
  }

  return (
    <div>
      <h1>Mirësevini në Dashboard</h1>
      {/* Nëse keni të dhëna, shfaq ato; përndryshe, shfaq 'Loading...' */}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
    </div>
  );
}
