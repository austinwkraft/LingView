import React from 'react';
import { ENGLISH, KANIENKEHA } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const landingPageJSX = {
  [ENGLISH]:
    <div>
      <p>Welcome! Click <a href='#/index'>"Index of Texts"</a> to see texts.</p>
      <p>A preliminary version of the site is available in Kanien'kéha. The site language controls are in the footer at the bottom of the window.</p>
      <p>This website is a final project for LING 415/610 at McGill University, Fall 2023. Other resources created by members of the McGill linguistics department and Kanien'kéha speakers are available at <a href='https://kanienkeha.lingspace.org/' target="_blank" rel="noopener noreferrer">https://kanienkeha.lingspace.org/</a> The site is powered by <a href='https://github.com/BrownCLPS/LingView/' target="_blank" rel="noopener noreferrer">Lingview</a>.</p>
      <p>For viewing media files on this site, we recommend using the Google Chrome web browser.</p>
    </div>,
  [KANIENKEHA]:
    <div>
      <p>Shé:kon! Ne ki' website ioteríhonte ne á:iontste' sénha aiòn:ronke' tsi aiontahónhsatate' ne okara'shòn:'a.</p>
    </div>,
};

export function LandingPage() {
  return <TranslatableText dictionary={landingPageJSX} />;
}
