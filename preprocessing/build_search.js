const path = require('path');

function buildSearch(jsonFileNames) {

    // Concatenate sentences from each story together
    let sentences = [];
    let tierNames = new Set(); // the set of tier checkboxes that will be displayed on the Search page
    let speakerNames = new Set(); // the set of speaker checkboxes that will be displayed on the Search page
    for (const jsonFileName of jsonFileNames) {
        const jsonPath = "data/json_files/" + jsonFileName;
        const f = require(path.resolve(__dirname, '../' + jsonPath));
        const storyID = f.metadata["story ID"];
        const title = f.metadata["title"]["_default"];
        const speakers = f.metadata["speaker IDs"];
        for (var speaker in speakers) {
            if (speakers[speaker]["name"] != null) {
                speakerNames.add(speakers[speaker]["name"]);
            }
        }
        const newSentences = f["sentences"];
        for (sentence in newSentences) {
            newSentences[sentence]["story ID"] = storyID;
            newSentences[sentence]["title"] = title;
            const speakerID = newSentences[sentence]["speaker"];
            newSentences[sentence]["speakers"] = [];
            if (speakers[speakerID]["name"] != null) {
                newSentences[sentence]["speakers"].push(speakers[speakerID]["name"]);
            }
        }
        sentences = sentences.concat(newSentences);
    }
  
    // Write sentences into search_index.json
    const data = [];
    for (const sentence of sentences) {
        const reformatted = {
          "num_slots" : sentence["num_slots"],
          "text" : sentence["text"],
          "story ID" : sentence["story ID"],
          "title" : sentence["title"],
          "start_time_ms" : sentence["start_time_ms"],
          "sentence_id" : sentence["sentence_id"], 
          "speakers" : sentence["speakers"],
          "dependents" : {}
        };

        // Top level line not included in sentence.dependents so it has to be handled separately
        const topTierName = sentence.tier; // defined for ELAN, undefined for FLEx
        if (topTierName != null) {
            tierNames.add(topTierName);
            reformatted["dependents"][topTierName] = {"value": sentence.text};
        }
        
        for (const tier of sentence["dependents"]) {
            tierName = tier.tier;
            tierNames.add(tierName);
            reformatted["dependents"][tierName] = tier.values;
        }
        data.push(reformatted);
    }
  
    return { "tier IDs": Array.from(tierNames), "speaker names": Array.from(speakerNames), "sentences": data };
}

module.exports = { buildSearch };