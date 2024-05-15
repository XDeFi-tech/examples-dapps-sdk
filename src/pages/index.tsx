import type { NextPage } from 'next';
import React from 'react';
import DefaultLayout from '@/layouts/default';

import Link from 'next/link';

const HomePage: NextPage = () => {
  const exampleDapps = [
    {
      name: 'Multichain DApp',
      path: '/multichain-dapp',
    },
    {
      name: 'Web3 DApp',
      path: '/web3-dapp',
    },
  ];

  return (
    <DefaultLayout>
      <div className="grid grid-cols-3 gap-3">
        {exampleDapps.map((dapp) => (
          <Link href={dapp.path} key={dapp.path}>
            <div className="border rounded-lg min-h-[100px] flex justify-center items-center text-2xl font-medium hover:bg-slate-100">
              {dapp.name}
            </div>
          </Link>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
