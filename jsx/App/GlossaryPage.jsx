import React from 'react';
import { ENGLISH, KANIENKEHA } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const glossaryPageJSX = {
  [ENGLISH] :
    <div>
      <p><i>Disclaimer; </i>We have done our best to gloss this story as accurately as possible, but it is entirely possible that we have made some mistakes along the way. We welcome and invite anyone to share their insights in places they feel are inaccurate or could use more information. If more stories and glosses are added to this website, we encourage the updating of this glossary page.</p>
      <p>To see examples of these terms, you can use the <a href = 'https://austinwkraft.github.io/LingView/#/search'>search function</a> and specify the morpheme gloss line.</p>
      <h2>Pre-pronominal prefixes</h2>
      <ul style={{ listStyleType: 'disc' }}>
            <li><b>CIS</b> - Cislocative: The cislocative indicates direction towards a point of reference with verbs that involve motion in a certain direction.</li>
            <li><b>COIN</b> - Coincident: The coincident is used to indicate simultaneous occurrence (i.e., event takes place at the same time as another event) in contexts in which the focus is on the time of the action.</li>
            <li><b>CONTR</b> - Contrastive: The contrastive indicates difference/contrast, and it is often used to express negation. The contrastive prefix is used in place of the negative one in the presence of an Optative, Factual, Future, or Duplicative prefix.</li>
            <li><b>DUP</b> - Duplicative: The duplicative conveys the basic meaning of two. While the usage of the duplicative is especially clear in verbs that involve numbers or quantity, the duplicative is also used with verbs that involve two objects (e.g., body parts that come in pairs), a change in position or location, or a change of state.</li>
            <li><b>FACT</b> - Factual: The factual is a modal prefix that is used to refer to an action or event that is completed, and thus can be considered an established fact (e.g., <i>he left</i>).</li>
            <li><b>FUT</b> - Future: The future is a modal prefix that is used to refer to an action or event that has not taken place yet but will take place sometime in the future (e.g., <i>he will leave</i>).</li>
            <li><b>ITER</b> - Iterative: The iterative expresses the repetition of an action or event observable on one single occasion.</li> 
            <li><b>NEG</b> - Negative: The negative is used to express negation (e.g., <i>he will not leave</i>).</li>
            <li><b>OPT</b> - Optative: The optative is a modal prefix that is used to refer to an action or event that has not taken place yet and either might take place (e.g., <i>he might leave</i>), ought to take place (e.g., <i>he should</i>), or might take place if certain conditions are met (e.g., <i>he would leave</i>).</li>
            <li><b>PART</b> - Partitive: The partitive is used to describe manner or extent. The partitive conveys the way an action is carried out or the extent to which the condition or state described by the verb is true (e.g., <i>it is really expensive</i>).</li>
            <li><b>TRANS</b> - Translocative: The translocative indicates motion away from a point of reference, usually the speaker (e.g., <i>that way</i>, or <i>over there</i>).</li>
      </ul>
      <h2>Aspectual suffixes</h2>
      <ul style={{ listStyleType: 'disc' }}>
            <li><b>HAB</b> - Habitual: The habitual aspect is used to express an ongoing or continuous action, as well as recurring events or actions (e.g., <i>I hunt</i>).</li>
            <li><b>FOR.PST</b> - Former past: The former past is used to describe an action or event that occurred regularly in the past but has stopped occurring (e.g., <i>I used to hunt</i>).</li>
            <li><b>PUNC</b> - Punctual: The punctual aspect describes an action that is a completed event. By describing events as complete events, the punctual aspect focuses more on the conclusion of an action or event rather than its progression.</li>
            <li><b>STAT</b> - Stative: The stative aspect describes states. The state may be an inherent condition (e.g., <i>He is tall</i>) or it may be the result of an earlier action (e.g., <i>I have cooked it</i>).</li>
        </ul>
        <h2>Derivational affixes</h2>
        <ul style = {{ listStyleType: 'disc'}}>
            <li><b>AUG</b> - Augmentative: The augmentative attaches to a noun to indicate that it is of a large size.</li>
            <li><b>BEN</b> - Benefactive: The benefactive is used to say that someone/something was affected by the action either positively or negatively (e.g., <i>He cooked for me</i>).</li>
            <li><b>CAUS</b> - Causative: The causative adds a participant to the event, someone who caused it to occur. The pronominal prefix may change to indicate a causer and/or a causee depending on the participants.</li>
            <li><b>DIM</b> - Diminutive: The diminutive in Kanien'kéha is most often seen on kinship terms. This suffix will almost always be attached to the roots of the kinship terms.</li>
            <li><b>DIST</b> - Distributive: The distributive acts as a sort of pluralizer. It can indicate that an action happens many times or that there are multiple participants.</li>
            <li><b>INCH</b> - Inchoative: The inchoative is used with stative verbs, and it describes the idea of "becoming" (e.g., <i>It became hard</i>).</li>
            <li><b>LOC</b> - Locative: The locative suffixes to nouns to indicate the location of something/someone. English equivalents roughly translate to phrases like <i>on the bed</i> or <i>in the field</i>.</li>
            <li><b>NMLZ</b> - Nominalizer: In Kanien'kéha, many nouns are formed by nominalizing verbs, and the nominalizer affix allows this to occur. These derived nouns can even be incorporated to make more complex verbal forms.</li>
            <li><b>NSF</b> - Noun Suffix: This suffix attaches to noun roots, and it indicates that the word should be treated as a noun.</li>
            <li><b>PURP</b> - Purposive: The purposive is used to express moving somewhere to perform an action. In English this means something like <i>to go do something</i> (e.g., <i>I go swimming</i>).</li>
            <li><b>REP</b> - Repetitive: The repetitive often signals that an action has been performed again. It can also be used to describe situations where something returns to its original state.</li>
            <li><b>SRFL</b> - Semi-reflexive: The semi-reflexive is often used to turn a verb that normally takes 2 participants (a doer and an undergoer) into a verb that has only one participant. (e.g., the difference between <i>I'm dressing her</i> vs. <i>I'm getting dressed</i>). The semi-reflexive is also commonly used with body parts (e.g., <i>He submerged his face</i>).</li>
        </ul>
        <h2>Inserted vowels</h2>
        <ul style={{ listStyleType: 'disc' }}>
            <li><b>EPEN</b> - Epenthetic vowel: This marking refers to a vowel that is inserted in between unallowable consonant clusters (<i>e</i>) or inserted at the start of the word to assign stress (<i>i</i>).</li>
            <li><b>JR</b> - Joiner vowel: This marking refers to a vowel that gets inserted after a verb or noun root that ends in a consonant, and before another consonant. The vowel used is almost always <i>a</i>.</li>
        </ul>
        <h2>Unanalyzable particles</h2>
        <ul style={{ listStyleType: 'disc' }}>
            <li><b>NE</b> - The NE particle has many uses. It occurs wherever something is deemed specific in its reference to the main statement or focus of discussion. Its interpretation will depend upon the word, phrase, or description it precedes (Kanatawakhon, 2009).</li>
            <li><b>SHE'S</b> - The particle SHE'S roughly translates to <i>customarily</i>, <i>habitually</i>, or <i>usually</i> in English (Karin Michelson, p.c.) while also emphasizing a past element—subsequently placing the situation in remote past (Wíshe Mitchell Mittelstaedt, p.c.).</li>
        </ul>
        <h2>Other labels</h2>
        <ul style={{ listStyleType: 'disc' }}>
            <li><b>EMPH</b> - Emphatic: The emphatic particle is used to indicate emphasis.</li>
            <li><b>EXCL</b> - Exclamation: An exclamation is an utterance made to indicate strong emotion or show emphasis. Examples of exclamations in English include <i>Gah!</i> <i>Hey!</i> <i>Wow!</i> and <i>Oh!</i></li>
            <li><b>Q</b> - Question: This particle is used to ask a question.</li>
        </ul>
        <h2>Guide to pronominal prefixes</h2>
        <ul style={{ listStyleType: 'disc' }}>
            <li><b>1</b> - First person: The first person refers to the speaker of the sentence.</li>
            <li><b>2</b> - Second person: The second person refers to the addressee(s) of the sentence.</li>
            <li><b>M</b> - Masculine: This marking refers to one or more animate males. If a group of people includes men and women, the M along with either Dual or Plural would express 'they/them.'</li>
            <li><b>FI</b> - Feminine-indefinite: This marking refers to an animate female. It cannot be used with plural marking.</li>
            <li><b>N</b> - Neuter: This marking refers to non-animate participants. The prefix roughly translates to 'it.'</li>
            <li><b>A</b> - Agent: Prefixes with this marking may also be described as subjective pronouns. It often indicates the "doer" of an action.</li>
            <li><b>P</b> - Patient: Prefixes with this marking may also be described as objective pronouns. It often indicates an "undergoer" of an action.</li>
            <li><b>EX</b> - Exclusive: In pronominal prefixes, this marking excludes the addressee (i.e., <i>others and I, not including you</i>).</li>
            <li><b>IN</b> - Inclusive: In pronominal prefixes, this marking includes the addressee (e.g., <i>we, others and I, including you</i>).</li>
            <li><b>SG</b> - Singular: This marking refers to one person.</li>
            <li><b>DU</b> - Dual: This marking refers to two people.</li>
            <li><b>PL</b> - Plural: This marking refers to more than two people.</li>
            <li>{'>'}<b></b> - This symbol is used in a transitive prefix, indicating that the verb accepts one or more objects (e.g., MPL {'>'} MSG: third-person male plural to third-person male singular transitive prefix, as in <i>they to him</i>).</li>
        </ul>
        <h2>References</h2>
        <ul>
          <li>DeCaire, Ryan. 2016. Kanien'kéha verb forms. Class materials, University of Toronto.</li>
          <li>DeCaire, Oherohskon Ryan. 2023. The role of adult immersion in Kanien'kéha revitalization. Doctoral Dissertation, University of Hawa'i at Hilo.</li> 
          <li>Kanatawakhon, David. 2009. Particles and particle phrases. Centre for Research and Teach of Canadian Native Languages.</li>
          <li>Michelson, Karin, and Catherine Price. 2011. Oneida, Cayuga, and Mohawk. Native Languages: A Support Document for the Teaching of Language Patterns. Ontario Ministry of Education.</li>
        </ul>
    </div>
    ,
  [KANIENKEHA] :
    <div>
      <p>A Kanien'kéha translation of this page is in our upcoming work. </p>
    </div>,
};

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
