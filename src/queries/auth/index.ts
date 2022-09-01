export const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;

export const AUTHENTICATION = `
mutation($request: SignedAuthChallenge!) { 
  authenticate(request: $request) {
    accessToken
    refreshToken
  }
}
`;

export const REFRESH_AUTHENTICATION = `
  mutation ($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export const CURRENT_PROFILE = `
query ($ownedBy: [EthereumAddress!]) {
    profiles(request: {ownedBy: $ownedBy}) {
      items {
        ...ProfileFields
        isDefault
        dispatcher {
          canUseRelay
          __typename
        }
        __typename
      }
      __typename
    }
    userSigNonces {
      lensHubOnChainSigNonce
      __typename
    }
  }
  `;

export const CREATE_PROFILE = `
  mutation($request: CreateProfileRequest!) { 
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
			__typename
    }
 }
`;

export const VERIFY = `
  query($request: VerifyRequest!) {
    verify(request: $request)
  }
`;

export const CREATE_SET_DEFAULT_PROFILE_TYPED_DATA = `
  mutation($request: CreateSetDefaultProfileRequest!) { 
    createSetDefaultProfileTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        wallet
        profileId
      }
    }
  }
}
`;
