import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="flex items-center gap-2 mb-5">
        <a href="/">
          <img src="/images/ctrl.svg" alt="XDEFI" width={40} height={40} />
        </a>
        <h1 className="text-[20px]">
          <Link href="/">Examples DApps</Link>
        </h1>
      </div>
    </header>
  );
}
