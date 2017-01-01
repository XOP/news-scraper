/* eslint no-new: 0 */

import Vue from 'vue';
import 'whatwg-fetch';
import Nes from 'nes';
import * as $ from 'xop-module-utils';

import sourceObjectToArray from './utils/source-obj-to-array.js';

import UpdateType from './components/update-type.vue';
import Progress from './components/progress.vue';

console.log('NewScraper client is up and running!');

// ++ vue.js scaffolding

const appData = {
    progress: {
        message: '...',
        initial: 0,
        current: 0,
        total: 50,
        isHidden: true
    }
};

new Vue({
    el: '.scraper',
    data: appData,
    computed: {},
    methods: {},
    components: {
        'update-type': UpdateType,
        'progress-bar': Progress
    }
});

// -- vue.js scaffolding

const client = new Nes.Client('ws://localhost:9000/scraper/');

const scraperSubmit = $.find('[data-id=scraper-submit]');
const scraperSpinner = $.find('[data-id=scraper-spinner]');
const scraperError = $.find('[data-id=scraper-error]');
const scraperErrorMessage = $.find('.message', scraperError);

const directiveGroups = $.findAll('[data-id=directive-group-check]');
const updateType = $.find('[data-id=update-type-value]');

directiveGroups.forEach(elem => {
    elem.addEventListener('change', function () {
        if (validateChecked(directiveGroups)) {
            scraperSubmit.disabled = '';
        } else {
            scraperSubmit.disabled = 'disabled';
        }
    });
});

// const scraperCancel = $.find('[data-id=scraper-cancel]');
//
// scraperCancel.addEventListener('click', function (evt) {
//     evt.preventDefault();
//
//     client.message('scrapingCancel', (err) => {
//         if (err) {
//             console.error(err);
//         }
//
//         // todo: retry process
//     });
// });

scraperSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();

    scraperError.style.display = 'none';
    scraperSpinner.style.display = 'block';

    const directivesBody = new FormData();

    const directiveGroupsChecked = directiveGroups.filter(elem => elem.checked);
    const directiveGroupsData = directiveGroupsChecked.reduce(
        (total, elem) => {
            let groupData = JSON.parse(elem.value);

            groupData = sourceObjectToArray(groupData);

            return total.concat(groupData);
        },
        []
    );

    directivesBody.append('directives', JSON.stringify(directiveGroupsData));

    const updateTypeValue = updateType.value;

    directivesBody.append('userCfg', JSON.stringify({
        limit: updateTypeValue
    }));

    const directiveGroupsTotal = directiveGroupsData.length;

    if (directiveGroupsTotal > 1) {
        appData.progress.isHidden = false;
        appData.progress.total = directiveGroupsTotal * 2; // showing progress for both start and finish
    }

    client.connect(err => {
        console.log('connect');

        if (err) {
            console.error('Socket connection error', err);
        }
    });

    client.onUpdate = ({ message, type }) => {
        switch (type) {
            case 'scrapingStart':
                appData.progress.message = `Now scraping from: ${message}`;
                appData.progress.current++;
                break;

            case 'scrapingEnd':
                appData.progress.message = `Done! ${message.length} news scraped`;
                appData.progress.current++;
                break;

            case 'scrapingAbort':
                appData.progress.message = message;
                break;

            case 'scrapingError':
                scraperError.style.display = 'block';
                scraperErrorMessage.innerText = `Oops, an error occurred: ${message} :(`;
                appData.progress.message = 'Refresh the page and give it another try!';
                break;

            default:
                appData.progress.message = message;
        }
    };

    fetch('/scraper', {
        method: 'POST',
        body: directivesBody
    }).then(res => {
        const redirectUrl = res.headers.get('X-Scraping-Redirect');

        // const state = res.headers.get('X-Scraping-State');

        if (res.ok) {
            if (redirectUrl) {
                window.location = redirectUrl;
            }

            return res.text();
        }
    }).then(textData => {
        console.log('data', JSON.parse(textData));
    }).catch(err => {
        console.error(err);

        scraperErrorMessage.innerText = `Something went wrong: ${err}`;
        scraperError.style.display = 'block';
    }).then(() => {
        client.disconnect();

        directiveGroups.forEach(elem => {
            elem.checked = false;
        });

        scraperSubmit.disabled = 'disabled';
        scraperSpinner.style.display = 'none';

        appData.progress.isHidden = true;
        appData.progress.current = appData.progress.initial;
    });
});

const groupCodeTrigger = $.findAll('[data-id=group-code-trigger]');

groupCodeTrigger.forEach(elem => {
    elem.addEventListener('click', function (evt) {
        evt.preventDefault();

        const groupCode = elem.parentNode;

        groupCode.classList.toggle('directive-group__code--is-opened');
    });
});

function validateChecked (group) {
    return group.filter(elem => elem.checked).length > 0;
}
