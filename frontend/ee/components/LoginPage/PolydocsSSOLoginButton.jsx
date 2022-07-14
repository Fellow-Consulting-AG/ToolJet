import React from 'react';
import { buildURLWithQuery } from '@/_helpers/utils';

export default function PolydocsSSOLoginButton({ configId }) {
  // const url = 'http://127.0.0.1:5000/oauth2/authorize';
  const url = 'https://dev.auth.cloudintegration.eu/oauth2/authorize';
  // console.log('-------------------------------------------');
  // console.log('configId: ', configId);
  const polydocsLogin = (e) => {
    e.preventDefault();
    // console.log('----------------------------------------------------------------');
    // console.log('url: ' + url);
    window.location.href = buildURLWithQuery(url, {
      client_id: 'JizaDkIEvikNCPKC5Lsu1tWZ',
      scope: 'profile',
      response_type: 'code',
      config_id: configId,
    });
  };
  return (
    <div data-cy="polydocs-tile">
      <button onClick={polydocsLogin} className="btn border-0 rounded-2">
        <img src="/assets/images/sso-buttons/polydocs.svg" className="h-4" data-cy="polydocs-icon" />
        <span className="px-1" data-cy="polydocs-sign-in-text">
          Sign in with Polydocs
        </span>
      </button>
    </div>
  );
}
