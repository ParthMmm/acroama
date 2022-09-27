import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Fragment, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Attachment from './Attachment';
import CollectModule from './CollectModule';
import * as Collapsible from '@radix-ui/react-collapsible';
type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  createComment: () => Promise<string | undefined>;
  setComment: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
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

function CommentModal({
  open,
  setOpen,
  createComment,
  setComment,
  isLoading,
}: Props) {
  const [file, setFile] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [selected, setSelected] = useState('FreeCollectModule');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [moduleOpen, setModuleOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
      };
      let c = reader.readAsArrayBuffer(file);
      setFile(URL.createObjectURL(file));
    });
  }, []);
  const moduleQuery = useQuery(MODULES_QUERY);

  //   useEffect(() => {
  //     setFile(acceptedFiles.map((single) => URL.createObjectURL(single))[0]);
  //   }, [acceptedFiles]);
  console.log(moduleQuery.data);

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
              <Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-2xl border-2 bg-grod-500 text-white border-gray-600 p-6 text-left align-middle shadow-xl transition-all'>
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
                      className='w-6 h-6'
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
                  {/* This will permanently deactivate your account */}
                </Dialog.Description>
                <Collapsible.Root open={moduleOpen}>
                  <form onSubmit={handleSubmit(createComment)}>
                    <div className='flex flex-col w-full  p-4'>
                      <div className=''>
                        <textarea
                          {...register('comment', { required: true })}
                          placeholder='comment'
                          className='w-full p-4 rounded-md resize-none text-white bg-grod-400 outline-none focus:placeholder-opacity-25 focus:ring focus:ring-burp-500 '
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <div className='flex justify-between  mt-2'>
                        <div className=''>
                          {/* <Collapsible.Trigger asChild>
                            <CollectModule
                              moduleOpen={moduleOpen}
                              setModuleOpen={setModuleOpen}
                            />
                          </Collapsible.Trigger> */}

                          <Attachment onDrop={onDrop} />
                        </div>
                        <button
                          type='submit'
                          disabled={isLoading}
                          className='bg-burp-500 px-3 font-bold h-10 hover:bg-burp-700 align-middle items-center transition-colors rounded-md '
                        >
                          Submit
                        </button>
                      </div>
                      <div className='p-4'>
                        {file ? (
                          <div className='relative'>
                            <button
                              onClick={() => setFile('')}
                              className='absolute top-[4%] left-[4%] z-10 hover:text-red-500'
                            >
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
                                  d='M6 18L18 6M6 6l12 12'
                                />
                              </svg>
                            </button>
                            <Image
                              src={file ? file : ''}
                              height='100%'
                              width='100%'
                              alt={file ? 'img' : ''}
                              layout='responsive'
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </form>
                  {/* <Collapsible.Content className='border-t-2'>
                    <div>
                      {moduleQuery?.data?.enabledModules?.collectModules.map(
                        (module) => {
                          return (
                            <button
                              className='w-full border-b-2 border-grod-200 p-2  disable cursor-not-allowed '
                              key={module.contractAddress}
                            >
                              <div
                                key={module.contractAddress}
                                className='flex flex-row justify-between'
                              >
                                <div
                                  className={`text-md text-grod-200 ${
                                    selected === module.moduleName
                                      ? 'text-burp-500 font-bold'
                                      : 'disabled'
                                  } `}
                                >
                                  {module.moduleName}
                                </div>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </Collapsible.Content> */}
                </Collapsible.Root>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CommentModal;
