import React from 'react';
import { ENGLISH, KANIENKEHA } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const glossaryPageJSX = {
  [ENGLISH] :
    <div>
      <p>This page could contain short descriptions of relevant glossing abbreviations, and/or a mapping between Leipzig-style glosses and language-internal terminology. </p>
    </div>,
  [KANIENKEHA] :
    <div>
      <p>A Kanien'kéha translation of this page is in progress. </p>
    </div>,
};

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
