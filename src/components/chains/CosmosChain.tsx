import React, { useState, useEffect } from 'react';
declare global {
  interface Window {
    xfi: any;
  }
}

const CosmosChain = ({
  account,
  chain,
}: {
  account: string;
  chain: string;
}) => {
  return (
    <div className="mt-3">
      <div className="text-center">Coming Soon!</div>
    </div>
  );
};

export default CosmosChain;
