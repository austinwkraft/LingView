import React from 'react';
import { ENGLISH, KANIENKEHA } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const glossaryPageJSX = {
  [ENGLISH] :
    <div>
      <p><i>Disclaimer; </i>We have done our best to gloss this story as accurately as possible, but it is entirely possible that we have made some mistakes along the way. We welcome and invite anyone to share their insights in places they feel are inaccurate or could use more information. If more stories and glosses are added to this website, we encourage the updating of this glossary page.</p>
      <ul>
            <li>CIS - Cislocative: The cislocative indicates direction towards a point of reference with verbs that involve motion in a certain direction.</li>
            <li>COIN - Coincident: The coincident is used to indicate simultaneous occurrence (i.e. event takes place at the same time as another event) in contexts in which the focus is on the time of the action.</li>
        </ul>
    </div>
  ,
  [KANIENKEHA] :
    <div>
      <p>A Kanien'kéha translation of this page is in progress. </p>
    </div>,
};

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
