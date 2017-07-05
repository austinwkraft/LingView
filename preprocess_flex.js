/* Assumes all morphemes within a document have the same set of "tiers" (i.e. language and type combinations, like english gloss) in the same order. */

var fs = require('fs');
var util = require('util');
var parseString = require('xml2js').parseString; // or we could use simple-xml
  
var xmlFileName = "C:\\Users\\Kalinda\\Documents\\MEGAsync\\Linguistics\\UTRA\\data_conversion\\singo_ai.xml";
var jsonFileName = "C:\\Users\\Kalinda\\Documents\\MEGAsync\\Linguistics\\UTRA\\data_conversion\\singo_ai_preprocessed.js"

function getTierName(lang, type) {
	// TODO decode FLEX's language and type codes so they're more human-readable? e.g. replace "con" with "Cofan"
	return lang + " " + type;
}

fs.readFile(xmlFileName, function (err, xml) {
  if (err) throw err;
  
  parseString(xml, function (err, jsonIn) {
	
	var jsonOut = {
		"metadata": {
			"tier IDs": {}
			// "speaker IDs" omitted (only used on elan files)
			},
		"sentences": []
	};
	
	var nextTierIDnum = 1;
	var tierIDs = {};
	// TODO make IDs for free translation tiers
	
	var textLang = "default"; // TODO use something better
	
	var wordsTierID = "T" + (nextTierIDnum++).toString();
	//tierIDs[textLang]["words"] = wordsTierID;
	jsonOut.metadata["tier IDs"][wordsTierID] = getTierName(textLang, "words");
	
	var paragraphs = jsonIn["document"]["interlinear-text"][0].paragraphs[0].paragraph;
	for (var wrappedParagraph of paragraphs) {
		var paragraph = wrappedParagraph.phrases[0].word;
		for (var wrappedSentence of paragraph) {
			var sentence = wrappedSentence.words[0].word;
			
			var morphsJson = {}; // tierID -> start_slot -> {"value": value, "end_slot": end_slot}
			morphsJson[wordsTierID] = {};
			var slotNum = 0;
			var sentenceText = "";
			// FIXME words tier will show up even when the sentence is empty of words
			
			for (var wordWithMorphs of sentence) {
				var wordValue = wordWithMorphs.item[0]._;
				sentenceText += wordValue + " "; // TODO omit space if next morpheme is punctuation
				process.stdout.write("\n" + wordValue + " ");
				
				var wordStartSlot = slotNum;
				
				if (wordWithMorphs.morphemes != null) {
					var morphs = wordWithMorphs.morphemes[0].morph;
					for (var wrappedMorph of morphs) {
						var morphTiers = wrappedMorph.item;
						for (var tier of morphTiers) {
							
							// if this is a new tier, register its ID and include it in metadata
							var tierLang = tier.$.lang;
							var tierType = tier.$.type;
							if (!tierIDs.hasOwnProperty(tierLang)) {
								tierIDs[tierLang] = {};
							}
							if (!tierIDs[tierLang].hasOwnProperty(tierType)) {
								var tierID = "T" + (nextTierIDnum++).toString();
								tierIDs[tierLang][tierType] = tierID;
								jsonOut.metadata["tier IDs"][tierID] = getTierName(tierLang, tierType);
							}
							
							// record the morph's value so it can be included in the output
							var tierID = tierIDs[tierLang][tierType];
							var tierValue = tier._;
							process.stdout.write(tierValue + " ");
							if (!morphsJson.hasOwnProperty(tierID)) {
								morphsJson[tierID] = {};
							}
							morphsJson[tierID][slotNum] = {
								"value": tierValue, 
								"end_slot": slotNum + 1
							};
						}
						slotNum++;
					}
				} else { // the "word" is probably just punctuation, and it gets its own slot
					slotNum++;
				}
				var wordEndSlot = slotNum;
				morphsJson[wordsTierID][wordStartSlot] = {
					"value": wordValue, 
					"end_slot": wordEndSlot
				};
			}
			
			var dependentsJson = [];
			for (var tierID in morphsJson) {
				if (morphsJson.hasOwnProperty(tierID)) {
					var valuesJson = [];
					for (var start_slot in morphsJson[tierID]) {
						if (morphsJson[tierID].hasOwnProperty(start_slot)) {
							valuesJson.push({
								"start_slot": parseInt(start_slot, 10),
								"end_slot": morphsJson[tierID][start_slot].end_slot,
								"value": morphsJson[tierID][start_slot].value
							})
						}
					}
					dependentsJson.push({
						"tier": tierID,
						"values": valuesJson
					});
				}
			}
			
			// "speaker, "start_time", and "end_time" omitted (they're only used on elan files)
			jsonOut.sentences.push({
				"num_slots": slotNum,
				"text": sentenceText,
				"dependents": dependentsJson
			});
		}
	}
	
	var prettyString = JSON.stringify(jsonOut, null, 2);
	fs.writeFile(jsonFileName, prettyString, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The converted file was saved. All done!");
	}); 
	
  });
});
