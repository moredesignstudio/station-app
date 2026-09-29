import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';
import { Credentials } from 'google-auth-library';

// The subset of a Google People API `Person` the app reads.
// Defined here so the app does not need the whole `googleapis` package.
// @see https://developers.google.com/people/api/rest/v1/people#Person
export type GooglePerson = {
  names?: {
    displayName?: string | null,
    givenName?: string | null,
    familyName?: string | null,
    metadata?: { source?: { id?: string | null } | null } | null,
  }[] | null,
  emailAddresses?: { type?: string | null, value?: string | null }[] | null,
  photos?: { url?: string | null }[] | null,
};

export type ElectronGoogleSignInResponse = {
  tokens: Credentials,
  profile: GooglePerson,
}

@service('electron-google-oauth')
export class ElectronGoogleOAuthService extends ServiceBase implements RPC.Interface<ElectronGoogleOAuthService> {
  @timeout(0)
  // @ts-ignore
  signIn(scopes: string[], forceAddSession?: boolean): Promise<ElectronGoogleSignInResponse> {}
}
