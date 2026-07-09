import React from 'react';
import Fuse from 'fuse.js';
import { SearchSentence } from './Stories/Story/Display/Sentence.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'
import { searchPagePromptText, searchPageNextButtonText, searchPagePrevButtonText } from './locale/LocaleConstants.jsx';
const dialect_filter = require('./dialect_filter.json');
var htmlEscape = require('ent/encode');
var decode = require('ent/decode');
// Note: tier names should be escaped when used as HTML attributes (e.g. data-tier=tier_name),
// but not when used as page text (e.g. <label>{tier_name}</label>)

let SEARCH_PAGE_SIZE = 20; // the number of search results to show on one page

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            searchResults: [], 
            searchIndex: null, 
            displayedSearchResultsIndex: 0
         };
        this.runSearch = this.throttle(this.search, 300, this);
        this.goToNextSearchPage = this.goToNextSearchPage.bind(this);
        this.goToPrevSearchPage = this.goToPrevSearchPage.bind(this);
    }

    componentDidMount() {
        import('~./data/search_index.json').then(i => {
            this.setState({ searchIndex: i.default })
        });
    }

    throttle(fn, threshhold, scope) {
        /*
        Takes in a function, threshold, and scope and returns a new
        function which will apply fn, at max, once per threshold
        credit: https://remysharp.com/2010/07/21/throttling-function-calls
        */
        var deferTimer;
        return function () {
            var context = scope || this;

            var args = arguments;

            if (deferTimer) clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                return fn.apply(context, args);
            }, threshhold);
        };
    }
    
    build_fuse() {
        let fields = [];
        document.getElementsByName("fields").forEach(function (e) {
            if (e.checked) fields.push(decode(`dependents.${e.id}.value`));
        });

        var options = {
            isCaseSensitive: false,
            shouldSort: true, // sort by relevance
            findAllMatches: true, // not just the first match in each tier
            ignoreLocation: true, // the match can be anywhere within the tier
            ignoreFieldNorm: true, // equal relevance for matches in long vs short strings
            threshold: 0.2, // 0.0 means perfect matches only, 1.0 matches anything
            keys: fields,
            useExtendedSearch: true
        };

        // Filter sentences to search using the selected filter options
        let speakers = []; // get list of checked speakers
        document.getElementsByName("speakers").forEach(function (e){
            if (e.checked) speakers.push(decode(e.id));
        });
        let dialects = []; // get list of checked dialects
        document.getElementsByName("dialects").forEach(function (e){ 
            if (e.checked) dialects.push(decode(e.id));
        })
        // filter sentences based on speakers, dialects, and duration
        let filteredSentences = this.state.searchIndex.sentences.filter(sentence => {
            // only filters on speakers if there are any checked, default is to include all sentences
            if (speakers.length != 0) {
                if (sentence["speakers"].length == 0) return false;
                for (const speaker of sentence["speakers"]) {
                    if (!speakers.includes(decode(speaker))) {
                        return false;
                    }
                }
            }
            // only filters on dialects if there are any checked, default is to include all sentences
            if (dialects.length != 0) {
                if (sentence["dialects"].length == 0) return false;
                // iterate through the dialect filter categories and create a list of accepted language codes associated with the checked dialect categories
                // dialect categories can be updated by editing the dialect_filter.json file
                var list = new Set();
                for (const category of dialects) {
                    // if any category has no language codes then it accepts all sentences with a language code, so we break the loop with an empty list
                    // as this will be treated as a catch-all filter
                    if (dialect_filter[category].length == 0) {
                        list.clear();
                        break;
                    } else {
                        dialect_filter[category].forEach(dialect => list.add(dialect));
                    }
                }
                // if the list is non-empty, then we filter out sentences that don't have a matching language code in the list of accepted codes
                if (list.size != 0) {
                    if (!sentence["dialects"].some(dialect => list.has(dialect))) {
                        return false;
                    }
                }
            }
            // filter out sentences that have a duration greater than the slider value
            if (sentence["story duration"] > document.getElementById("duration").value) return false;
            return true;
        });
        // searches only on sentences that pass the user filters
        return new Fuse(filteredSentences, options)
    }

    search(rebuild=true) {
        if (rebuild || !this.fuse) this.fuse = this.build_fuse();
        let input = document.getElementById("searchInput");
        if (input) {
            var query = input.value;
        } else {
            return;
        }
        let searchResult = this.fuse.search(query); 
        let searchResults = [];
        for (var i = 0, j = searchResult.length; i < j; i++) {
            if ('speaker' in searchResult[i]) {
                let component = (<SearchSentence sentence={searchResult[i].item} true />);
                searchResults.push(component);
            } else {
                let component = (<SearchSentence sentence={searchResult[i].item} false />);
                searchResults.push(component);
            }
        }
        this.setState({ "searchResults": searchResults });
    }
    
    handleInputChange() {
        this.runSearch(false);
    }

    genFilters () { // called by render()
        // generates the tier filter checkboxes, speaker filter checkboxes, dialect filter checkboxes, and duration filter slider
        let filterOpts = [];
        let tiers = this.state.searchIndex['tier IDs'];
        filterOpts.push(<label><b>Tiers to search:</b></label>);
        tiers.forEach((tier) => {
            filterOpts.push(
                <input id={htmlEscape(tier)} name="fields" type="checkbox" onChange={this.search.bind(this)}
                defaultChecked />
            );
            filterOpts.push(<label>{tier}</label>);
            filterOpts.push(<span>&nbsp;&nbsp;</span>);
        })
        let speakerNames = this.state.searchIndex['speaker names'];
        filterOpts.push(<br />);
        filterOpts.push(<br />);
        filterOpts.push(<label><b>Speakers to search:</b></label>);
        speakerNames.forEach((speaker) => {
            filterOpts.push(
                <input id={htmlEscape(speaker)} name="speakers" type="checkbox" onChange={this.search.bind(this)}
                defaultUnchecked />
            );
            filterOpts.push(<label>{speaker}</label>);
            filterOpts.push(<span>&nbsp;&nbsp;</span>);
        });
        let dialectNames = Object.keys(dialect_filter);
        filterOpts.push(<br />);
        filterOpts.push(<br />);
        filterOpts.push(<label><b>Dialects to search:</b></label>);
        dialectNames.forEach((dialect) => {
            filterOpts.push(
                <input id={htmlEscape(dialect)} name="dialects" type="checkbox" onChange={this.search.bind(this)}
                defaultUnchecked />
            );
            filterOpts.push(<label>{dialect}</label>);
            filterOpts.push(<span>&nbsp;&nbsp;</span>);
        });
        filterOpts.push(<br />);
        filterOpts.push(<br />);
        filterOpts.push(<div class="slidecontainer">
                        <label><b>Maximum Media Duration (This slider is activated only if there are multiple files in the search query):</b></label> <br />
                        <form>
                        <input type="range" class="slider" id="duration" defaultValue={this.state.searchIndex['max duration']} 
                            min={this.state.searchIndex['min duration']} max={this.state.searchIndex['max duration']} 
                            onInput={function () {
                                document.getElementById("durationValue").innerHTML = (document.getElementById("duration").value / 60).toFixed(0) + ":" + (document.getElementById("duration").value % 60).toString().padStart(2, '0');
                            }}
                            onChange={this.search.bind(this)} />
                        <p>Value (minutes): <span id="durationValue"></span></p>
                        </form>
                        </div>);
        let button = <button class="searchOptsCollapsible" onClick={this.filterOptionsToggle.bind(this)}>Show Filters</button>;
        
        return <div> {button} <div id="checkboxContainer">
             {filterOpts}
        </div></div>;
    }

    filterOptionsToggle() {
        let container = document.getElementById("checkboxContainer");
        let button = document.getElementsByClassName("searchOptsCollapsible")[0];
        if (container.style.display === "none") {
            container.style.display = "block";
            button.innerHTML = "Hide Filters";
        } else {
            container.style.display = "none";
            button.innerHTML = "Show Filters";
        }
    }

    goToNextSearchPage() {
        let newDisplayIndex = this.state.displayedSearchResultsIndex + SEARCH_PAGE_SIZE;
        this.setState({ displayedSearchResultsIndex: newDisplayIndex });
    }

    goToPrevSearchPage() {
        let newDisplayIndex = this.state.displayedSearchResultsIndex - SEARCH_PAGE_SIZE;
        this.setState({ displayedSearchResultsIndex: newDisplayIndex });
    }

    render() {
        if (!this.state.searchIndex) return <div className="loader">Loading Search...</div>; // (could use a dedicated loader component instead)
        let results = this.state.searchResults.slice(
            this.state.displayedSearchResultsIndex, 
            Math.min(this.state.displayedSearchResultsIndex + SEARCH_PAGE_SIZE, this.state.searchResults.length));  
        return (
            <div id="searchForm">
                <label for="searchInput"><TranslatableText dictionary={searchPagePromptText} /></label> <input id="searchInput" onChange={this.handleInputChange.bind(this)} type="text" />
                <p>To search for forms containing two specific elements, separate the elements with a space. For example, 'FACT PUNC' will return all utterances containing a word with both FACT and PUNC. To search for forms containing one element or another, separate the elements with the pipe symbol |. For example, 'FACT|HAB' will return all utterances containing either FACT or HAB.</p>
                <br />
                {this.genFilters()}
                <br />
                <div><i>Showing {Math.min(this.state.displayedSearchResultsIndex + 1, this.state.searchResults.length)} to {Math.min(this.state.displayedSearchResultsIndex + SEARCH_PAGE_SIZE, this.state.searchResults.length)} of {this.state.searchResults.length} results</i></div>
                <br />
                <div id="searchResults">{results}</div>
                {this.state.searchResults.length > 0 ?
                    <div>
                        <button class="searchPageButton" 
                                onClick={this.goToPrevSearchPage}
                                disabled={this.state.displayedSearchResultsIndex <= 0}>
                            <TranslatableText dictionary={searchPagePrevButtonText} />
                        </button>
                        <button class="searchPageButton" 
                                onClick={this.goToNextSearchPage}
                                disabled={this.state.searchResults.length === 0 || 
                                    this.state.displayedSearchResultsIndex + SEARCH_PAGE_SIZE >= this.state.searchResults.length}>
                            <TranslatableText dictionary={searchPageNextButtonText} />
                        </button>
                    </div> : null}
            </div>
        )
    };
}
