import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import formData from 'form-data';
import got from 'got';
import UserResponse from './models/user_response';
// import FormData from 'form-data';

@Injectable()
export class PolydocsOAuthService {
  private prefix = '';
  private prefix_tooljet = '';
  private redirectUrl = '';
  private getUserUrl = '';
  private tokenUrl = '';
  constructor(private readonly configService: ConfigService) {
    // only use prefix to determine the auth service url
    const prefix_env = this.configService.get<string>('PREFIX');
    if (prefix_env === 'sandbox') {
      this.prefix_tooljet = 'sandbox.';
    } else {
      this.prefix = prefix_env + '.';
    }

    this.redirectUrl = 'https://' + this.prefix_tooljet + 'insight.polydocs.io/login/oauth/authorize';
    this.tokenUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/oauth2/token';
    this.getUserUrl = 'https://' + this.prefix + 'auth.cloudintegration.eu/api/me';
  }

  // AuthResponse will need to be changed!
  async #getUserDetails(access_token: string): Promise<UserResponse> {
    const response: any = await got(this.getUserUrl, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).json();

    // console.log('response of url:' + this.getUserUrl + ' , res: ' + JSON.stringify(response));

    const email = response.username;
    const firstName = response.first_name;
    const lastName = response.last_name;
    const is_admin = response.is_admin || response.is_organisation_admin ? true : false;

    console.log('email: ' + email + ' firstName: ' + firstName + ' lastName: ' + lastName + ' isAdmin: ' + is_admin);

    return {
      userSSOId: access_token,
      firstName,
      lastName,
      email,
      sso: 'polydocs',
      is_admin: is_admin,
    };
  }

  async signIn(code: string, configs: any): Promise<any> {
    // console.log('enter signIn function');
    const token =
      'Basic Sml6YURrSUV2aWtOQ1BLQzVMc3UxdFdaOkd5anlmdGlYZVNBVG0zNFNQWEJmRFhIN3FaRjRuNHFCUFNZNnpJaGU5WVdEVnFKWQ==';
    // 'Basic ' + Buffer.from(configs.clientId + ':' + configs.clientSecret).toString('base64');

    // console.error('----------------------------------------------------------------');
    // console.error('redirectUrl: ' + this.redirectUrl + ' requestUrl: ' + this.tokenUrl + '\n\ncode: ' + code);
    // this.redirectUrl = 'http://127.0.0.1:8082/login/oauth/authorize';

    const response: any = await got
      .post(this.tokenUrl, {
        form: {
          grant_type: 'authorization_code',
          client_id: 'JizaDkIEvikNCPKC5Lsu1tWZ',
          code: code,
          redirect_uri: this.redirectUrl,
        },
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      })
      .json();

    console.log('----------------------------------------------------');
    console.log('response access_token: ' + JSON.stringify(response));

    return await this.#getUserDetails(response['access_token']);
  }
}
