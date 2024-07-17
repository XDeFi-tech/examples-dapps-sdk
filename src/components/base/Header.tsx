import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/images/App Icon Black.svg';

export default function Header() {
  return (
    <header>
      <div className="flex items-center gap-2 mb-5">
        <Link href="/">
          <Image src={Logo} alt="Logo" width={40} height={40} />
        </Link>
        <h1 className="text-[20px]">
          <Link href="/">Examples DApps</Link>
        </h1>
      </div>
    </header>
  );
}
