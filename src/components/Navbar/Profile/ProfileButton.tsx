import { Menu, Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import {
  CheckCircleIcon,
  CogIcon,
  LogoutIcon,
  MoonIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SunIcon,
  SwitchHorizontalIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { Fragment } from 'react';
import { useDisconnect } from 'wagmi';

type Props = {};

function ProfileButton({}: Props) {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profiles = useAppStore((state) => state.profiles);
  const { disconnect } = useDisconnect();
  console.log(currentProfile, '🥷');

  return (
    <Menu as='div' className=''>
      {({ open }) => (
        <>
          <Menu.Button
            // as='img'
            // src={getAvatar(currentProfile as Profile)}
            className='w-8 h-8 rounded-full   cursor-pointer dark:border-gray-700/80 items-center justify-center flex'
            // alt={currentProfile?.handle}
          >
            <span>
              {' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </span>
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items
              static
              className='absolute right-0 py-4 px-4 mt-2 w-48 bg-white rounded-xl border shadow-sm dark:bg-gray-800 focus:outline-none dark:border-gray-700/80'
            >
              <Menu.Item>
                <div>
                  <div>Logged in as</div>
                  <div className='truncate '>
                    <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-purple-500 text-sm'>
                      @{currentProfile?.handle}
                    </span>
                    {/* <span className='text-white bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400 text-xs sm:text-sm font-bold'>
                      @{currentProfile?.handle}
                    </span> */}
                  </div>
                </div>
              </Menu.Item>
              <div className='border-b border-gray-700/80' />
              <Menu.Item as={'a'} href={`/u/${currentProfile?.handle}`}>
                <div className='flex items-center space-x-2 my-2'>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                      />
                    </svg>
                  </span>
                  <div className='pl-1'>Your Profile</div>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className='flex items-center space-x-2 my-2'>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495'
                      />
                    </svg>
                  </span>
                  <div className='pl-1'>Settings</div>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className='flex items-center space-x-2 my-2'>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
                      />
                    </svg>
                  </span>
                  <div className='pl-1'>
                    <button onClick={() => disconnect()}>Logout</button>
                  </div>
                </div>
              </Menu.Item>

              <div className='border-b border-gray-700/80' />
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

export default ProfileButton;
