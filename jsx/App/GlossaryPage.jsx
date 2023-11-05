import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const glossaryPageJSX = {
  [ENGLISH] :
    <div>
      <p>This page could contain short descriptions of relevant glossing abbreviations, and/or a mapping between Leipzig-style glosses and language-internal terminology. </p>
    </div>,
  [ESPANOL] :
    <div>
      <p>Ingrese el glosario aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/GlossaryPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [FRANCAIS] :
    <div>
      <p>Saisissez le glossaire ici :) </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/GlossaryPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
