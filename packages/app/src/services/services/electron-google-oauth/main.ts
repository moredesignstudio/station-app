import { Credentials } from 'google-auth-library';
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
import log from 'electron-log';

import { RPC } from '../../lib/types';
import { ElectronGoogleOAuthService, ElectronGoogleSignInResponse, GooglePerson } from './interface';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export class ElectronGoogleOAuthServiceImpl extends ElectronGoogleOAuthService implements RPC.Interface<ElectronGoogleOAuthService> {
  async signIn(scopes: string[], forceAddSession?: boolean): Promise<ElectronGoogleSignInResponse> {

    const client = new ElectronGoogleOAuth2(CLIENT_ID, CLIENT_SECRET, scopes, { successRedirectURL: 'https://github.com/getstation/desktop-app' });
    return client.openAuthWindowAndGetTokens(forceAddSession)
      .then(async (tokens) => {
        try {
          // Direct People API request: loading `googleapis` would pull every Google API into memory
          const response = await client.oauth2Client.request<GooglePerson>({
            url: 'https://people.googleapis.com/v1/people/me',
            params: {
              personFields: 'names,emailAddresses,photos',
              sources: 'READ_SOURCE_TYPE_PROFILE',
            },
          });

          return { tokens, profile: response.data };
        }
        catch (err) {
          log.error(`Google profile request error ${err}`);
          return this.parseToken(tokens);
       }
      });
  }

  private parseToken(tokens: Credentials): ElectronGoogleSignInResponse {
    try {
      //vk: id_token format https://developers.google.com/identity/gsi/web/reference/js-reference#credential
      const decodedStr = Buffer.from(tokens.id_token!.split('.')[1], 'base64').toString()
      const tokenPayload = JSON.parse(decodedStr);

      return { 
        tokens, 
        profile: {
          names: [
            {
              metadata: {
                source: {
                  id: tokenPayload.sub,
                }
              },
              displayName: tokenPayload.name,
              givenName: tokenPayload.given_name,
              familyName: tokenPayload.family_name,
            }
          ],
          emailAddresses: [
            {
              type: '',
              value: tokenPayload.email,
            }
          ],
          photos: [
            {
              url: tokenPayload.picture,
            }
          ]
        } 
      };
    }
    catch (err) {
      log.error(`Parse token error ${err}`);
      return { 
        tokens, 
        profile: {
          names: [
            {
              displayName: 'unknown',
            }
          ],
          emailAddresses: [
            {
              type: '',
              value: 'unknown',
            }
          ]
        } 
      };
    };
  }
}
