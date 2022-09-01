// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import Cookies, { CookieAttributes } from 'js-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

export const COOKIE_CONFIG: CookieAttributes = {
  sameSite: 'None',
  secure: true,
  expires: 360,
};

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

const httpLink = new HttpLink({
  uri: 'https://api-mumbai.lens.dev',
  fetchOptions: 'no-cors',
  fetch,
});

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  // if your using node etc you have to handle your auth different
  const accessToken = Cookies.get('accessToken');

  // console.log('111', accessToken);
  if (accessToken === 'undefined' || !accessToken) {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    return forward(operation);
  }

  operation.setContext({
    headers: {
      'x-access-token': accessToken ? `Bearer ${accessToken}` : '',
    },
  });

  // if (accessToken === 'undefined' || !accessToken) {
  //   Cookies.remove('accessToken');
  //   Cookies.remove('refreshToken');

  //   return forward(operation);
  // } else {
  //   console.log('222');

  //   operation.setContext({
  //     headers: {
  //       'x-access-token': accessToken ? `Bearer ${accessToken}` : '',
  //     },
  //   });

  //   const { exp }: { exp: number } = jwtDecode(accessToken);
  //   console.log('333');

  // if (Date.now() >= exp * 1000) {
  //   axios(API_URL, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     data: JSON.stringify({
  //       operationName: 'Refresh',
  //       query: REFRESH_AUTHENTICATION_MUTATION,
  //       variables: {
  //         request: { refreshToken: Cookies.get('refreshToken') },
  //       },
  //     }),
  //   })
  //     .then(({ data }) => {
  //       const refresh = data?.data?.refresh;
  //       operation.setContext({
  //         headers: {
  //           'x-access-token': accessToken
  //             ? `Bearer ${refresh?.accessToken}`
  //             : '',
  //         },
  //       });
  //       Cookies.set('accessToken', refresh?.accessToken, COOKIE_CONFIG);
  //       Cookies.set('refreshToken', refresh?.refreshToken, COOKIE_CONFIG);
  //     })
  //     .catch(() => console.log(ERROR_MESSAGE));
  // }
  // console.log('444');

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
