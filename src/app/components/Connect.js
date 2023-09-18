import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Cookies from 'js-cookie';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';

const Connect = () => {
  const { publicKey } = useWallet();
  const solanaAddress = publicKey ? publicKey.toBase58() : null;

    if (solanaAddress !== null) {
        // Set the token in a cookie
        Cookies.set('walletId', solanaAddress);

        // Use window.location.href to redirect
        window.location.href = '/app';
      }

  return (
    <div className="mb-32 text-center">
      <WalletMultiButton />
    </div>
  );
};

export default Connect;
