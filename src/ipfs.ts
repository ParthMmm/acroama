import { create } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_INFURA_ID;
const api_key = process.env.NEXT_PUBLIC_API_KEY;

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${projectId}:${api_key}`,
      'utf-8'
    ).toString('base64')}`,
  },
});

export const uploadIpfs = async <T>(data: T) => {
  const result = await client.add(JSON.stringify(data));

  console.log('upload result ipfs', result);
  return result;
};
