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

function getOAuthHeaders(auth: FluigAuthObject) {
  let result = '';

  const oAuthMethod = 'PLAINTEXT';
  const oAuthVersion = '1.0';
  const timestamp = Math.round(Date.now() / 1000);
  const nonce = randomString(10);

  const secret = `${auth.consumerSecret}&${auth.tokenSecret}`;

  result = `OAuth oauth_consumer_key="${auth.consumerKey}",oauth_token="${auth.accessToken}",oauth_signature_method="${oAuthMethod}",oauth_timestamp="${timestamp}",oauth_nonce="${nonce}",oauth_version="${oAuthVersion}",oauth_signature="${secret}"`;

  return result;
}

export default async function testConnection(
  domainUrl: string,
  auth: FluigAuthObject
): Promise<any | null> {
  let result = null;
  try {
    result = await axios.get(`${domainUrl}/api/public/2.0/users/getCurrent`, {
      headers: {
        Authorization: getOAuthHeaders(auth),
      },
    });
  } catch (err: any) {
    result = err.response;
  }

  return result;
}
