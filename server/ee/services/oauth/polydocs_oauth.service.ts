import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import formData from 'form-data';
import got from 'got';
import UserResponse from './models/user_response';
// import FormData from 'form-data';

@Injectable()
export class PolydocsOAuthService {
  private prefix = '';
  private suffix = '';
  private redirectUrl = '';
  private getUserUrl = '';
  private tokenUrl = '';
  constructor(private readonly configService: ConfigService) {
    // only use prefix to determine the auth service url
    const prefix_env = this.configService.get<string>('PREFIX');
    if (prefix_env === 'prod' || prefix_env === 'sandbox') {
      this.prefix = '';
    } else {
      this.prefix = prefix_env + '.';
    }

    if (this.configService.get<string>('TOOLJET_HOST').endsWith('/') === false) {
      this.suffix = '/';
      // console.log('set suffix to: ' + this.suffix);
    }
    // this.prefix = 'dev.';
    // console.log(
    //   'this.configService.get<string>("TOOLJET_HOST").endsWith("/"): ' +
    //     this.configService.get<string>('TOOLJET_HOST').endsWith('/') +
    //     ' - ' +
    //     this.configService.get<string>('TOOLJET_HOST') +
    //     this.suffix +
    //     'login/oauth/authorize'
    // );
    this.redirectUrl = this.configService.get<string>('TOOLJET_HOST') + this.suffix + 'login/oauth/authorize';
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

    // console.log('email: ' + email + ' firstName: ' + firstName + ' lastName: ' + lastName);

    return {
      userSSOId: access_token,
      firstName,
      lastName,
      email,
      sso: 'polydocs',
    };
  }

  async signIn(code: string, configs: any): Promise<any> {
    // console.log('enter signIn function');
    const token = 'Basic ' + Buffer.from(configs.clientId + ':' + configs.clientSecret).toString('base64');

    // console.log('--------------------------------');
    // console.log('redirectUrl: ' + this.redirectUrl + ' requestUrl: ' + this.tokenUrl);

    const response: any = await got
      .post(this.tokenUrl, {
        form: {
          grant_type: 'authorization_code',
          client_id: configs.clientId,
          code: code,
          redirect_uri: this.redirectUrl,
        },
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      })
      .json();

    // console.log('----------------------------------------------------');
    // console.log('response access_token: ' + JSON.stringify(response));

    return await this.#getUserDetails(response['access_token']);
  }
}
