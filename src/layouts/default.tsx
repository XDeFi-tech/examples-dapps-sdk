import Head from 'next/head';
import React from 'react';
import Header from '@/components/base/Header';

const DefaultLayout = ({ children }: any) => {
  return (
    <>
      <Head>
        <title>Examples DApps</title>
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="Examples DApps" />
      </Head>
      <div className="min-h-dvh container m-auto p-5">
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
};

export default DefaultLayout;
