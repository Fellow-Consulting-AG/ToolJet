import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import UserResponse from './models/user_response';

@Injectable()
export class PolydocsOAuthService {
  private prefix = '';
  private suffix = '';
  constructor(private readonly configService: ConfigService) {
    // only use prefix to determine the auth service url
    if (this.configService.get<string>('PREFIX') === 'prod' || this.configService.get<string>('PREFIX') === 'sandbox') {
      this.prefix = '';
    } else {
      this.prefix = this.configService.get<string>('PREFIX') + '.';
    }

    if (this.configService.get<string>('TOOLJET_HOST').slice(-1) !== '/') {
      this.suffix = '/';
    }
  }

  private readonly authUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/oauth2/authorize';
  private readonly tokenUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/oauth2/token';
  private readonly getUserUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/api/me';
  private readonly serverUrl = this.configService.get<string>('TOOLJET_HOST') + this.suffix;


  // AuthResponse will need to be changed!
  async #getUserDetails({ access_token }: AuthResponse): Promise<UserResponse> {
    const response: any = await got(this.getUserUrl, {
      method: 'get',
      headers: { Accept: 'application/x-www-form-urlencoded', Authorization: `Bearer ${access_token}` },
    }).json();

    const email = response.data.username;
    const firstName = response.data.first_name;
    const lastName = response.data.last_name;

    return { userSSOId: access_token, firstName, lastName, email, sso: 'polydocs' };
  }

  async signIn(code: string, configs: any): Promise<any> {
    /* auth code -> new endpoint

    I want to open up the login page and login the user -> by chance pass the email + password to the login automatically.

    after login i need the token 
    scope -> profile




    signIn -> login on auth -> token -> getUserDetails -> setup user

    1. get call grant_type: authorization_code, client_id, redirect_uri -> insight uri
    2. get code -> send request to token
    */
    // const formData = new FormData();
    const token = 'Basic ' + new Buffer(configs.clientId + ':' + configs.clientSecret, 'base64').toString();

    const url =
      this.authUrl +
      '?client_id=' +
      configs.clientId +
      '&scope=profile' +
      '&redirect_uri=' +
      this.serverUrl +
      'login/oauth/authorize' +
      '&response_type=code';

    console.log('token for auth: ' + token);
    console.log('url for auth: ' + url);

    const response: any = await got(url, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: token,
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
