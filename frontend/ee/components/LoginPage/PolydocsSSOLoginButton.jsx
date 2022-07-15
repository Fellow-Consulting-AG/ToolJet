import React from 'react';
import { buildURLWithQuery } from '@/_helpers/utils';

export default function PolydocsSSOLoginButton({ _configId }) {
  const base_url = window.location.host;
  let prefix = '';
  if (base_url.includes('dev')) {
    prefix = 'dev.';
  } else if (base_url.includes('stage')) {
    prefix = 'stage.';
  } else if (base_url.includes('sandbox')) {
    prefix = 'sandbox';
  }

  const url = 'https://' + prefix + 'app.polydocs.io/oauth/login';
  const polydocsLogin = (e) => {
    e.preventDefault();
    window.location.href = buildURLWithQuery(url, {});
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
