import { NextPage } from 'next';
import React from 'react';

import DefaultLayout from '@/layouts/default';

const Web3Dapp: NextPage = () => {
  return (
    <DefaultLayout>
      <div className="">
        <h2 className="text-center text-3xl font-semibold">Web3 DApp</h2>
        <div className="text-center italic">Coming Soon!</div>
      </div>
    </DefaultLayout>
  );
};

export default Web3Dapp;
