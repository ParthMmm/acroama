import {
  TypedDataDomain,
  TypedDataField,
} from '@ethersproject/abstract-signer';
import { ethers, utils, Wallet } from 'ethers';
import { SigningKey, BytesLike } from 'ethers/lib/utils';
// import { MUMBAI_RPC_URL, PK } from './config';
import { omit } from './helpers';

export const ethersProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_MUMBAI_RPC_URL
);
const PK: BytesLike | SigningKey = process.env.NEXT_PUBLIC_PK;

export const getSigner = () => {
  return new Wallet(process.env.NEXT_PUBLIC_PK, ethersProvider);
};

export const getAddressFromSigner = () => {
  return getSigner().address;
};

export const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, any>
) => {
  const signer = getSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const sendTx = (
  transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) => {
  const signer = getSigner();
  return signer.sendTransaction(transaction);
};

export const signText = (text: string) => {
  return getSigner().signMessage(text);
};
