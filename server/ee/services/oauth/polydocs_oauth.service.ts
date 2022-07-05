import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import UserResponse from './models/user_response';

@Injectable()
export class PolydocsOAuthService {
  private prefix = '';
  constructor(private readonly configService: ConfigService) {
    // only use prefix to determine the auth service url
    if (this.configService.get<string>('PREFIX') === 'prod' || this.configService.get<string>('PREFIX') === 'sandbox') {
      this.prefix = '';
    } else {
      this.prefix = this.configService.get<string>('PREFIX') + '.';
    }
  }
  private readonly authUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/oauth2/token';
  private readonly getUserUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/api/me';
  private readonly getUserEmailUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/api/me';

  // AuthResponse will need to be changed!
  async #getUserDetails({ access_token }: AuthResponse): Promise<UserResponse> {
    const response: any = await got(this.getUserUrl, {
      method: 'get',
      headers: { Accept: 'application/json', Authorization: `token ${access_token}` },
    }).json();

    const { name } = response;
    let { email } = response;
    const words = name?.split(' ');
    const firstName = words?.[0] || '';
    const lastName = words?.length > 1 ? words[words.length - 1] : '';

    if (!email) {
      // email visibility not set to public
      email = await this.#getEmailId(access_token);
    }

    return { userSSOId: access_token, firstName, lastName, email, sso: 'git' };
  }

  async #getEmailId(access_token: string) {
    const response: any = await got(this.getUserEmailUrl, {
      method: 'get',
      headers: { Accept: 'application/json', Authorization: `X-API-KEY ${access_token}` },
    }).json();

    return response?.find((emails) => emails.primary)?.email;
  }

  async signIn(code: string, configs: any): Promise<any> {
    const response: any = await got(this.authUrl, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + btoa(configs.clientId + ':' + configs.clientSecret),
      },
    }).json();

    return await this.#getUserDetails(response);
  }
}

interface AuthResponse {
  access_token: string;
  scope?: string;
  token_type?: string;
}
