import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href='https://fonts.googleapis.com/css?family=Archivo:400,400i,500,500i,600,600i,700,700i&display=optional'
          rel='stylesheet'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
