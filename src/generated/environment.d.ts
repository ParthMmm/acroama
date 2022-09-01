import { LENS_API } from '../config';
export {};
import { SigningKey, BytesLike } from 'ethers/lib/utils';
import { AlchemyProviderConfig } from '@alchemy-protocol/types/lib/alchemy-provider-config';
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALCHEMY_KEY: AlchemyProviderConfig;
      NEXT_PUBLIC_MUMBAI_RPC_URL: string;
      NEXT_PUBLIC_PK: SigningKey | BytesLike;
      ENV: 'test' | 'dev' | 'prod';
      CHAIN_ID: number;
      LENS_API: string;
      NEXT_PUBLIC_INFURA_ID: string;
      NEXT_PUBLIC_API_KEY: string;
    }
  }
}
