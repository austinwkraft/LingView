import id from 'shortid';
import { storySearchText, storySearchViewStoryText } from '~./jsx/App/locale/LocaleConstants.jsx';
import { TranslatableText } from '~./jsx/App/locale/TranslatableText.jsx';
var htmlEscape = require("html-es6cape");
const glossDict = require('./gloss_dict.json');

// Note: tier names should be escaped when used as HTML attributes (e.g. data-tier=tier_name),
// but not when used as page text (e.g. <label>{tier_name}</label>)

function GlossLine({text}) {
	// I/P: text, a string with the text of the glossing line
	// O/P: array of text components including tooltips as needed
	const word = String(text);
	let expArray = [];
	// Split the string into individual morphemes
	let morphArray = word.split('-');

   	// For each morpheme, access the entry in glossDict and append it to the explanation
    const i = morphArray.length;
    for(let j = 0; j < i; j++) {
		// We want to keep the - used to separate morphemes 
		let wordActual = morphArray[j];
		if (j < i-1) {wordActual = wordActual+'-'};
		// find morphs within square brackets
		let morphArray2 = morphArray[j].split(/[\[\]]/);
		// if the morpheme is in the glossary, add a span element with the corresponding tooltip
        if (glossDict.hasOwnProperty(morphArray[j])) {
            expArray.push(<a class="tooltip" key={id.generate()} >{wordActual}<span>{glossDict[morphArray[j]]}</span></a>);
        }
		// handle case where morpheme has square brackets
		else if (morphArray2.length > 1) {
			// check the part outside the brackets against the glossary
			if (glossDict.hasOwnProperty(morphArray2[0])) {
				expArray.push(<a class="tooltip" key={id.generate()} >{morphArray2[0]}<span>{glossDict[morphArray2[0]]}</span></a>);
			} else {
				expArray.push(<span key={id.generate()}>{morphArray2[0]}</span>);
			}
			// check the part inside the brackets against the glossary
			if (glossDict.hasOwnProperty(morphArray2[1])) {
				expArray.push(<a class="tooltip" key={id.generate()} >[{morphArray2[1]}]<span>{glossDict[morphArray2[1]]}</span></a>);
			} else {
				expArray.push(<span key={id.generate()}>[{morphArray2[1]}]</span>);
			}
			// add hyphen if not last morpheme
			if (j < i-1) {
				expArray.push(<span key={id.generate()}>-</span>);
			}
		}
		else {
			expArray.push(<span key={id.generate()}>{wordActual}</span>);
		}
	};
	return expArray;
}

function Row({ numSlots, values, tier }) {
	// I/P: numSlots, taken from parent sentence
	//      values, list of segments (e.g., morphemes) with start/end times
	//      tier, the tier name
	// O/P: single row of glossed sentence, with colspan spacing

	// Building a row requires slots to determine the width of certain
	// table elements. Each element will have a start and end slot, and
	// if there is a gap between an end slot and the following start
	// slot, then a blank table element is input. We use the attribute
	// 'colSpan' to account for elements which require large slots.

	// The currentSlot counter is used to 'fill in' the missing
	// slots when a dependent tier doesn't line up with its corresponding
	// independent tier. For example, if the i-tier goes from 0-12, and
	// the dependent tier goes from 2-5 and 7-12, then the currentSlot
	// counter would be responsible for filling those gaps between 0-2
	// and 5-7.
	const finalSlot = numSlots;
	let currentSlot = 0;
	let output = []; 

	for (const v of values) {
		const startSlot = v['start_slot'];
		const endSlot = v['end_slot'];
		const text = v['value'];

		// Add blank space before current value:
		if (startSlot > currentSlot) {
			const diff = String(startSlot - currentSlot);
			output.push(<td key={id.generate()} colSpan={diff}> </td>);
		}
		// Create element with correct 'colSpan' width:
		const size = String(endSlot - startSlot);
		if (tier == 'morpheme gloss'){ 
			// Only add glossing explanation on the tier corresponding to the morpheme gloss
			// Generate the components for the tooltips
			let exp = <GlossLine key={id.generate()} text={text}/>;
			// add to the table data component
			output.push(<td key={id.generate()} colSpan={size}>{exp}</td>);
		}
		else {
			output.push(<td key={id.generate()} colSpan={size}>{text}</td>);
		}
		currentSlot = endSlot;
	}
	// Fill blank space at end of table row:
	if (currentSlot < finalSlot) {
		const diff = String(finalSlot - currentSlot);
		output.push(<td key={id.generate()} colSpan={diff} />);
	}
	return <tr data-tier={htmlEscape(tier)}>{output}</tr>;
}

function IndependentTiers({ Tiers }) {
	// I/P: Tiers, list of independent tiers from Sentence
	// O/P: list of flex items containing the idependant tiers represented as p elements
	let expArray = [];
	for (const {values, tier} of Tiers) {
		// add the glossing explainations for the gloss tier if applicable
		if (tier == 'morpheme gloss') {
			let exp = <GlossLine key={id.generate()} text={values[0]['value']}/>;
			expArray.push(<p key={id.generate()} className = "indepItem" data-tier={htmlEscape(tier)}>{exp}</p>);
		} else {
			expArray.push(<p key={id.generate()} className = "indepItem" data-tier={htmlEscape(tier)}>{values[0]['value']}</p>);
		}
	}
	return expArray;
}

function DependentTiers({ Tiers, tierList }) {
	// I/P: Tiers,list of dependent tiers from Sentence
	//	    tierList, list of dependent tier names
	// O/P: list of dependent tier flex items containing each segment of the dependent tiers grouped by column

	// Each dependent tier item represents a segment of the dependent tiers that share the same slot range.
	// The segments are separated into slot ranges based on the first dependent tier, as all other tiers must be partitioned
	// within the boundaries of its parent tier, and parent tiers must appear before child tiers.
	// To accomplish this, we create a map from starting slot number to tier segments that fall within that slot range. 
	// We then go through this mapping and create a dependent tier item for each slot range containing a table displaying the 
	// segments for each tier, including further tier subdivisions and filling in blank slots.

	let slots = {}; // map from slot number to list of {value, tier} objects corresponding to that slot. 
	let slotArray = []; // list of slot numbers
	let expArray = []; // array to collect the output expressions
	// make the slots map from the first dependent tier (as it has the minimal partition of the sentence)
	// populate the slot map with the values from the dependent tiers.
	let counter = 0;
	for (const {values, tier} of Tiers) {
		if (counter == 0) {
			// create the slot map using start slots from the first dependent tier
			for (const v of values) {
				slotArray.push(v['start_slot']);
				slots[v['start_slot']] = [];
			}
			counter++;
		}
		// populate the slot map with values
		for (const v of values) {
			// get the start slot for the slot range that this value falls within
			let slotNum = v['start_slot'];
			while (!slotArray.includes(slotNum)) {
				// if the start slot is not in the slot array, decrement until we find the closest slot
				slotNum--;
				if (slotNum < 0) {
					// this should never happen, but just in case, assign to slot 0
					slotNum = 0;
					break;
				}
			}
			// add the value (with tier name) to the corresponding slot in the slot map
			slots[slotNum].push({value: v['value'], tier: tier, start_slot: v['start_slot'], end_slot: v['end_slot']});
		}
	}
	// go through the slot map and create a dependent tier item for each slot range
	for (var key in slots) {
		// get slot range from first value (as the first value will be from the first dependent tier)
		const end = slots[key][0]['end_slot'];
		const start = slots[key][0]['start_slot'];
		let numSlots = end - start;
		// group values by tier so that values from the same tier are in the same row of the table
		// there will only be multiple values for a tier if that tier has more subdivisions than the first dependent tier
		const tierGroups = Object.groupBy(slots[key], x => x.tier);
		let rowArray = [];
		// for each tier, create a table row containing the values for this slot range and fill in blank slots as needed
		for (const tier of tierList) {
			let values = tierGroups[tier];
			// if there are no values, add a blank row
			if (!values) {
				rowArray.push(<tr data-tier={htmlEscape(tier)}><td key={id.generate()}> </td></tr>);
				continue;
			}
			let currentSlot = key;
			let exp = [];
			// iterate through values and add table data components with correct colSpans and fill in blank slots as needed
			for (const value of values) {
				const startSlot = value['start_slot'];
				const endSlot = value['end_slot'];
				const text = value['value'];
				// fill in blank slots before current value
				if (currentSlot < startSlot) {
					const diff = String(startSlot - currentSlot);
					exp.push(<td key={id.generate()} colSpan={diff}/>);
				}
				const size = String(endSlot - startSlot);
				// add glossing explanation for the gloss tier if applicable
				if (tier == 'morpheme gloss') {
					let gloss = <GlossLine key={id.generate()} text={text}/>;
					exp.push(<td key={id.generate()} colSpan={size}>{gloss}</td>);
				} else {
					exp.push(<td key={id.generate()} colSpan={size}>{text}</td>);
				}
				currentSlot = endSlot;
			}
			// fill in blank slots at the end of the row if needed
			if (currentSlot < key + numSlots) {
				const diff = String(key + numSlots - currentSlot);
				exp.push(<td key={id.generate()} colSpan={diff}/>);
			}
			// push the filled row to the row array
			rowArray.push(<tr data-tier={htmlEscape(tier)}>{exp}</tr>);
		}
		// push the dependent tier item for this slot range to the expression array
		expArray.push(<table key={id.generate()} className="depItem"><tbody>{rowArray}</tbody></table>);
	}
	return expArray;
}

export function Sentence({ sentence }) {
	// I/P: sentence, a sentence
	// O/P: flexbox container with items corresponding to independent tiers and grouped dependent tiers

	// Split tiers in to top row, independent, and dependent tiers then generate the flex items for each category
	let itemList = []; // to be output
	const numSlots = sentence['num_slots'];
	// identify the top row if it exists, and add the top row item to the item list
  	if (sentence['noTopRow'] == null || sentence['noTopRow'] === 'false') {
    itemList.push(
      <p className="topRowItem" data-tier={htmlEscape(sentence['tier'])}>
		{sentence['text']}
      </p>
    );
  	}
	const dependents = sentence['dependents']; // all tiers that are not the top row tier
	// Note: I use independent and dependent tiers here to refer to tiers which are not partitioned into segments (independent)
	// vs tiers which are partitioned into segments (dependent), not the ELAN usage of dependents
	let indepTiers = new Set();
	let noteTiers = new Set(); // independenttiers with 'note' in the name are put at the end of the sentence display
	let depTiers = new Set();
	let depTiersList = [];
	for (const dep of dependents) {
		// if there is only one segment and it spans the entire sentence, this is an independent tier
		if (dep['values'].length == 1 && 
			dep['values'][0]['start_slot'] == 0 &&
			dep['values'][0]['end_slot'] == numSlots) {
			if (dep['tier'].toLowerCase().includes('note')) {
				noteTiers.add(dep);
			} else {
				indepTiers.add(dep);
			}
		// otherwise add the tier to the dependent tier list
		} else {
			depTiers.add(dep);
			depTiersList.push(dep['tier']);
		}
	}
	// generate the flex items for each category and add to the item list
	itemList = [...itemList, <IndependentTiers key={id.generate()} Tiers={indepTiers}/>];
	itemList = [...itemList, <DependentTiers key={id.generate()} Tiers={depTiers} tierList={depTiersList}/>];
	itemList = [...itemList, <IndependentTiers key={id.generate()} Tiers={noteTiers}/>];
	return <div className="sentenceContainer">{itemList}</div>;
}


export function SearchSentence({ sentence }) {
	// I/P: sentence, a sentence
	// O/P: displayed rows, along with a link to corresponding story
	let rowList = []; // to be output
	const numSlots = sentence['num_slots'];
    const title = sentence['title'];
	const dependents = sentence['dependents'];
	// Add each dependent tier to the row list:
	for (const tier of Object.keys(dependents)) {
        if (dependents[tier][0] == undefined) {
            // row is top row
            rowList.push(
              <tr data-tier={htmlEscape(sentence['tier'])}>
                <td colSpan={numSlots} className="topRow">{sentence['text']}</td>
              </tr>
            );
        } else {
            // row is not top row
            rowList.push(<Row key={id.generate()} numSlots={numSlots} values={dependents[tier]} tier={tier} />);
        }
	}

	// Get URL:
	const at = document.URL.indexOf("search");
	let url = document.URL.substring(0,at);

	// The query index is either start time (for Timed files) 
	// or sentence id for (Untimed files)
	let query_index = sentence.start_time_ms || sentence.sentence_id; 
	url += ("story/" + sentence["story ID"] + "?" + query_index);

    // hacky way to introduce a line break (extra <tr> of height 12px)
	return <div className="searchSentence">
				<table className="gloss">
					<thead>
						<tr>
					    	<td>
								<b> <TranslatableText dictionary={storySearchText} /></b>: {title}
							</td>
						</tr>
						<tr style={{"height": "12px"}}></tr>
					</thead>
					<tbody>{rowList}</tbody>
				</table>
				<div class="storyLink">
					<a target="_blank" href={url}>
						<TranslatableText dictionary={storySearchViewStoryText} />
					</a>
				</div>
			</div>;
}
