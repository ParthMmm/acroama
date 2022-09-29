import { Dialog, Transition } from '@headlessui/react';
import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { Fragment, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Attachment from './Attachment';
import CollectModule from './CollectModule';
import * as Collapsible from '@radix-ui/react-collapsible';
import { create } from 'ipfs-http-client';
import { uploadImageIpfs, uploadIpfs } from 'src/ipfs';
import { v4 as uuid } from 'uuid';
import { client } from 'src/ipfs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LensterAttachment } from '@generated/lenstertypes';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  createComment: () => Promise<string | undefined>;
  setComment: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  attachments: LensterAttachment[];
  setAttachments: Dispatch<SetStateAction<LensterAttachment[]>>;
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
const validationSchema = z.object({
  comment: z.string({
    required_error: 'required',
    invalid_type_error: ' must be a string',
  }),
});

function CommentModal({
  open,
  setOpen,
  createComment,
  setComment,
  isLoading,
  setAttachments,
  attachments,
}: Props) {
  const [file, setFile] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [selected, setSelected] = useState('FreeCollectModule');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(validationSchema) });
  const [fileUrl, updateFileUrl] = useState(``);
  const [moduleOpen, setModuleOpen] = useState(false);

  const moduleQuery = useQuery(MODULES_QUERY);

  //   useEffect(() => {
  //     setFile(acceptedFiles.map((single) => URL.createObjectURL(single))[0]);
  //   }, [acceptedFiles]);
  // console.log(moduleQuery.data);

  const onChange = (e) => {
    const file = e.target.files[0];
    setFile(URL.createObjectURL(file));
    setFileInfo(file);
  };

  // const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const form = event.target as HTMLFormElement;
  //   const files = (form[0] as HTMLInputElement).files;

  //   if (!files || files.length === 0) {
  //     return alert('No files selected');
  //   }

  //   const file1 = files[0];
  //   console.log(file1);
  //   // upload files
  //   // const result = await uploadImageIpfs(file1);

  //   console.log(result);

  //   form.reset();
  // };

  const submitHandler = async (data) => {
    console.log(data);
    // console.log(file)
    console.log(fileInfo?.name, fileInfo?.size, fileInfo?.type);

    // const result = await uploadImageIpfs(fileInfo);
    // result.path
    const attachment: LensterAttachment = {
      item: 'QmVYbNGQMHjCJxDfUyp2veVkBCVCkZYhZhveKsZ1UeKhsd',
      type: fileInfo?.type,
      altTag: '',
    };
    // console.log(result);

    attachments.push(attachment);
    createComment();
    console.log(attachments);
  };

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
                  {/* This will permanently deactivate your account */}
                </Dialog.Description>
                <Collapsible.Root open={moduleOpen}>
                  <form onSubmit={handleSubmit(submitHandler)}>
                    <div className='flex w-full flex-col  p-4'>
                      <div className=''>
                        <textarea
                          {...register('comment', { required: true })}
                          placeholder='comment'
                          className='w-full resize-none rounded-md bg-grod-400 p-4 text-white outline-none focus:placeholder-opacity-25 focus:ring focus:ring-burp-500 '
                          // onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <div className='mt-2 flex  justify-between'>
                        <div className=''>
                          {/* <Collapsible.Trigger asChild>
                            <CollectModule
                              moduleOpen={moduleOpen}
                              setModuleOpen={setModuleOpen}
                            />
                          </Collapsible.Trigger> */}

                          {/* <button type='submit'>Upload File</button>{' '} */}

                          {/* <label
                            className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                            htmlFor='file_input'
                          >
                            Upload file
                          </label> */}
                          {/* <input
                            className='block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                            id='file_input'
                            type='file'
                          /> */}

                          <label
                            htmlFor='file_input'
                            className='cursor-pointer'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='h-5 w-5'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                              />
                            </svg>
                          </label>
                          <input
                            name='file'
                            type='file'
                            accept='image/png, image/jpeg'
                            className='hidden'
                            id='file_input'
                            onChange={onChange}
                          />
                        </div>
                        <button
                          type='submit'
                          disabled={isLoading}
                          className='h-10 items-center rounded-md bg-burp-500 px-3 align-middle font-bold transition-colors hover:bg-burp-700 '
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
                                className='h-5 w-5'
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
          <Image
            src={fileUrl ? fileUrl : ''}
            height='100%'
            width='100%'
            alt={fileUrl ? 'img' : ''}
            layout='responsive'
          />
        </div>
      </Dialog>
    </Transition>
  );
}

export default CommentModal;
