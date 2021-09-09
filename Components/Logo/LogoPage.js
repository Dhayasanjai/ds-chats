import React from 'react';
import Logo from '../../public/Logo.png';
import Image from 'next/image';
function LogoPage() {
  return (
    <div
      style={{ background: '#fcde67' }}
      className="hidden md:grid place-content-center w-3/4"
    >
      <Image src={Logo} alt="logo image" height="300" width="300"></Image>
      <p className="text-center font-bold text-3xl">DS Chats...</p>
    </div>
  );
}

export default LogoPage;
