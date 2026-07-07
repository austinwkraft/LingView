const path = require('path');

function buildSearch(jsonFileNames) {

    // Concatenate sentences from each story together
    let sentences = [];
    let tierNames = new Set(); // the set of tier checkboxes that will be displayed on the Search page
    let speakerNames = new Set(); // the set of speaker checkboxes that will be displayed on the Search page
    let maxDuration = 0; // the maximum story duration across all stories, used to set the max value of the time slider on the Search page
    let minDuration = Infinity; // the minimum story duration across all stories, used to set the min value of the time slider on the Search page
    for (const jsonFileName of jsonFileNames) {
        const jsonPath = "data/json_files/" + jsonFileName;
        const f = require(path.resolve(__dirname, '../' + jsonPath));
        const storyID = f.metadata["story ID"];
        const title = f.metadata["title"]["_default"];
        const duration = f["sentences"][f["sentences"].length - 1]["end_time_ms"] / 1000;
        if (duration > maxDuration) {
            maxDuration = duration;
        }
        if (duration < minDuration) {
            minDuration = duration;
        }
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
            newSentences[sentence]["story duration"] = duration;
            const speakerID = newSentences[sentence]["speaker"];
            newSentences[sentence]["speakers"] = [];
            newSentences[sentence]["dialects"] = [];
            if (speakers[speakerID]["name"] != null) {
                newSentences[sentence]["speakers"].push(speakers[speakerID]["name"]);
            }
            if (speakers[speakerID]["language"] != null) {
                newSentences[sentence]["dialects"].push(speakers[speakerID]["language"]);
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
          "story duration" : sentence["story duration"],
          "sentence_id" : sentence["sentence_id"], 
          "speakers" : sentence["speakers"],
          "dialects" : sentence["dialects"],
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
  
    return { "tier IDs": Array.from(tierNames), "speaker names": Array.from(speakerNames), "max duration": maxDuration, "min duration": minDuration, "sentences": data };
}

module.exports = { buildSearch };