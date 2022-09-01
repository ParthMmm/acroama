import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import LoginModal from './Login/LoginModal';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import CreateModal from './Create/CreateModal';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
function ModalHandler({ isOpen, setIsOpen }: Props) {
  //   const [isOpen, setIsOpen] = useState(false);
  const { address, connector: activeConnector, isConnected } = useAccount();
  const profiles = useAppStore((state) => state.profiles);

  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  console.log({ isConnected, isAuthenticated, profiles, isOpen });

  const innerModal = () => {
    if (isConnected && !isAuthenticated) {
      return <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />;
    }
    if (isConnected && isAuthenticated && profiles.length === 0) {
      console.log('🚣‍♂️');

      return <CreateModal isOpen={isOpen} setIsOpen={setIsOpen} />;
    } else {
      setIsOpen(false);
      return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className='relative z-50'
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div
        className='fixed inset-0 bg-black/40 bg-opacity-75 transition-opacity'
        aria-hidden='true'
      />

      {/* Full-screen container to center the panel */}
      <div className='fixed inset-0 flex items-center justify-center '>
        {/* The actual dialog panel  */}
        {innerModal()}
      </div>
    </Dialog>
  );
}

export default ModalHandler;
