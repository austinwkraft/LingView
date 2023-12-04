import React from 'react';
import { ENGLISH, KANIENKEHA } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const aboutPageJSX = {
  [ENGLISH]:
    <div>
      <p>This site is a pilot adaptation of LingView by students at McGill University in collaboration with Kanienke'há:ka, for educational purposes. At this time, the website remains as a pre-release. The material is currently under construction. We thank you for your understanding and interest.</p>
      <p>The purpose of this website is to support Kanien'kéha language learners. The stories available on this website are shared with the consent of the speakers.</p>
    </div>,
  [KANIENKEHA]:
    <div>
      <p>Ne ki' website ioteríhonte ne á:iontste' sénha aiòn:ronke' tsi aiontahónhsatate' ne okara'shòn:'a. McGill University ronteweiénhstha nok ò:ni Kanien'kehá:ka rotíhson.</p>
    </div>,
};

export function AboutPage() {
  return <TranslatableText dictionary={aboutPageJSX} />;
}
