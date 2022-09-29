import { Dialog, Transition } from '@headlessui/react';
import {
  Fragment,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const MODULES_QUERY = gql`
  query EnabledModules {
    enabledModules {
      collectModules {
        moduleName
        contractAddress
      }
    }
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`;

function CollectModuleModal({ open, setOpen }: Props) {
  const moduleQuery = useQuery(MODULES_QUERY);

  // const modules = () => {
  //   return moduleQuery?.data.map((module) => {
  //     console.log(module);
  //   });
  // };

  // modules();

  // console.log(modules);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={() => setOpen(false)} as='div' className='relative z-10'>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-2xl border-2 border-gray-600 bg-grod-500 p-6 text-left align-middle text-white shadow-xl transition-all'>
                <div className='flex flex-row justify-between'>
                  <Dialog.Title className='text-lg font-light '>
                    New Post
                  </Dialog.Title>
                  <button onClick={() => setOpen(false)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>

                <Dialog.Description>
                  This will permanently deactivate your account
                </Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CollectModuleModal;
