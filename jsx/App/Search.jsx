import React from 'react';
import Fuse from 'fuse.js';
import { SearchSentence } from './Stories/Story/Display/Sentence.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'
import { searchPagePromptText, searchPageNextButtonText, searchPagePrevButtonText } from './locale/LocaleConstants.jsx';
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
        //console.log("fields:", fields);

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

        let speakers = [];
        document.getElementsByName("speakers").forEach(function (e){
            if (e.checked) speakers.push(decode(e.id));
        });
        //console.log("speakers:", speakers);
        let fileredSentences = [];
        if (speakers.length == 0) {
            fileredSentences = this.state.searchIndex.sentences;
        } else {
            for (const sentence of this.state.searchIndex.sentences) {
                for (const speaker of sentence["speakers"]) {
                    if (speakers.includes(decode(speaker))) {
                        fileredSentences.push(sentence);
                        break;
                    }
                }
            }
        }
        //console.log("searchIndex.sentences:", this.state.searchIndex.sentences);
        //console.log("filteredSentences:", fileredSentences);
        return new Fuse(fileredSentences, options)
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

    genCheckboxes () { // called by render()
        let checkboxes = [];
        let tiers = this.state.searchIndex['tier IDs'];
        checkboxes.push(<label><b>Tiers to search:</b></label>);
        tiers.forEach((tier) => {
            checkboxes.push(
                <input id={htmlEscape(tier)} name="fields" type="checkbox" onChange={this.search.bind(this)}
                defaultChecked />
            );
            checkboxes.push(<label>{tier}</label>);
            checkboxes.push(<span>&nbsp;&nbsp;</span>);
        })
        let speakerNames = this.state.searchIndex['speaker names'];
        checkboxes.push(<br />);
        checkboxes.push(<br />);
        checkboxes.push(<label><b>Speakers to search:</b></label>);
        speakerNames.forEach((speaker) => {
            checkboxes.push(
                <input id={htmlEscape(speaker)} name="speakers" type="checkbox" onChange={this.search.bind(this)}
                defaultUnchecked />
            );
            checkboxes.push(<label>{speaker}</label>);
            checkboxes.push(<span>&nbsp;&nbsp;</span>);
        });
        return checkboxes
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
                {this.genCheckboxes()}
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
