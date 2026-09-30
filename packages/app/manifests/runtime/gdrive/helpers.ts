import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
import { SDK, search, tabs } from '@getstation/sdk';
import memoizee = require('memoizee');

import { idExtractor } from './activity';

// The fields of the Drive API resources this plugin reads.
// Plain REST requests replace the `googleapis` package, which loads every Google API into memory.
// @see https://developers.google.com/drive/api/reference/rest/v3/files
export type Schema$File = {
  kind?: string | null,
  id?: string | null,
  name?: string | null,
  mimeType?: string | null,
  webViewLink?: string | null,
  iconLink?: string | null,
};
type Schema$FileList = { files?: Schema$File[] };
// @see https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
type Schema$Userinfoplus = { email?: string | null, name?: string | null, picture?: string | null };

const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const isBlankRegex = /^\s*$/;

export class ElectronGDriveOAuth2 extends ElectronGoogleOAuth2 {

  constructor(clientId: string, clientSecret: string) {
    super(
      clientId,
      clientSecret,
      ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/userinfo.profile']
    );

    this.getFile = memoizee(this.getFile.bind(this), { maxAge: 15000 });
    this.getUserInfos = memoizee(this.getUserInfos.bind(this), { maxAge: 15000 });
  }

  async listFiles(query: string) {
    if (query.match(isBlankRegex)) return [] as Schema$File[];
    // Reference: https://developers.google.com/drive/v3/reference/files/list
    // All files properties: https://developers.google.com/drive/v3/reference/files#resource

    const response = await this.oauth2Client.request<Schema$FileList>({
      url: DRIVE_FILES_URL,
      params: {
        pageSize: 10,
        orderBy: 'viewedByMeTime desc',
        supportsTeamDrives: true,
        includeTeamDriveItems: true,
        fields: 'files(kind,id,name,mimeType,webViewLink,iconLink)',
        q: `name contains '${query}'`,
      },
    });
    return response.data.files || [];
  }

  async getUserInfos(): Promise<Schema$Userinfoplus> {
    const response = await this.oauth2Client.request<Schema$Userinfoplus>({ url: USERINFO_URL });
    return response.data;
  }

  async getFile(fileId: string): Promise<Schema$File & { email: string }> {
    const file = await this.oauth2Client.request<Schema$File>({
      url: `${DRIVE_FILES_URL}/${encodeURIComponent(fileId)}`,
      params: { fields: 'kind,id,name,mimeType,webViewLink,iconLink' },
    });

    const { email } = await this.getUserInfos();

    return { ...file.data, email: email || '' };
  }
}

export function getGDriveFileAsSearchResult(sdk: SDK, item: Schema$File, accountLabel?: string): search.SearchResultItem {
  const matchingTab = sdk.tabs
    .getTabs()
    .find((t: tabs.Tab) => idExtractor(t.url) === item.id);

  const onSelect = matchingTab ?
    async () => await sdk.tabs.navToTab(matchingTab.tabId) :
    undefined;

  return {
    resourceId: item.id,
    category: !accountLabel ? 'Google Drive' : `Google Drive - ${accountLabel}`,
    label: item.name,
    context: accountLabel,
    imgUrl: item.iconLink,
    manifestURL: sdk.search.id,
    onSelect,
    url: item.webViewLink,
  };
}

export function getGDriveFilesAsSearchResults(sdk: SDK, files: Schema$File[], accountLabel?: string): search.SearchResultWrapper {
  /**
   * Sample of what an item in searchResult looks like
   * { kind: 'drive#file',
     * id: '1ZBomcyRF0reGagZorrWesRgoQ8YMnBt8cHrgaLRsrro',
     * name: 'Station\'s users export - September 2017 V2.csv',
     * mimeType: 'application/vnd.google-apps.spreadsheet',
     * webViewLink: 'https://docs.google.com/spreadsheets/d/1ZBomcyRF0reGagZorrWesRgoQ8YMnBt8cHrgaLRsrro/edit?usp=drivesdk',
     * iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet' }
   */
  return {
    results: files.map(
      file => getGDriveFileAsSearchResult(sdk, file, accountLabel)),
  };
}
