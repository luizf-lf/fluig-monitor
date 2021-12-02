import axios from 'axios';

interface FluigAuthObject {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  tokenSecret: string;
}

function randomString(length: number) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getOAuthHeaders(url: string, auth: FluigAuthObject) {
  let result = '';

  const oAuthMethod = 'PLAINTEXT';
  const oAuthVersion = '1.0';
  const timestamp = Math.round(Date.now() / 1000);
  const nonce = randomString(10);
  // const base = `GET&${encodeURIComponent(
  //   url
  // )}&oauth_consumer_key=${encodeURIComponent(
  //   auth.consumerKey
  // )}&oauth_nonce=${encodeURIComponent(
  //   nonce
  // )}&oauth_signature_method=${encodeURIComponent(
  //   oAuthMethod
  // )}&oauth_timestamp=${encodeURIComponent(
  //   timestamp
  // )}&oauth_token=${encodeURIComponent(
  //   auth.accessToken
  // )}&oauth_version=${encodeURIComponent(oAuthVersion)}`;

  const secret = `${auth.consumerSecret}&${auth.tokenSecret}`;

  // const signature = HmacSHA1(base, secret);

  result = `OAuth oauth_consumer_key="${auth.consumerKey}",oauth_token="${auth.accessToken}",oauth_signature_method="${oAuthMethod}",oauth_timestamp="${timestamp}",oauth_nonce="${nonce}",oauth_version="${oAuthVersion}",oauth_signature="${secret}"`;

  console.log(result);

  return result;
}

export default function testConnection(
  domainUrl: string,
  auth: FluigAuthObject
) {
  axios
    .get(`${domainUrl}api/public/2.0/users/getCurrent`, {
      headers: {
        Authorization: getOAuthHeaders(domainUrl, auth),
      },
    })
    .then((response) => {
      console.log(response.data);
      return null;
    })
    .catch((e) => {
      console.log(e);
    });
}
