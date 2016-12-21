/* eslint no-new: 0 */

import Vue from 'vue';
import 'whatwg-fetch';
import Nes from 'nes';
import * as $ from 'xop-module-utils';

import sourceObjectToArray from './utils/source-obj-to-array.js';

import UpdateType from './components/update-type.vue';

console.log('NewScraper client is up and running!');

// ++ vue.js scaffolding

new Vue({
    el: '.scraper__settings',
    data: {},
    computed: {},
    methods: {},
    components: {
        'update-type': UpdateType
    }
});

// -- vue.js scaffolding

const client = new Nes.Client('ws://localhost:9000/scraper/');

// const scraperProgressElement = $.find('progress', scraperProgress);
const scraperProgress = $.find('[data-id=scraper-progress]');
const scraperProgressMessage = $.find('.progress__message', scraperProgress);

const scraperSubmit = $.find('[data-id=scraper-submit]');
const scraperCancel = $.find('[data-id=scraper-cancel]');
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

scraperCancel.addEventListener('click', function (evt) {
    evt.preventDefault();

    client.message('scrapingCancel', (err, msg) => {
        if (err) {
            console.error(err);

            return;
        }

        console.log(msg);

        // todo: server callback

        scraperSpinner.style.display = 'none';
        scraperProgress.style.display = 'none';
    });
});

scraperSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();

    scraperError.style.display = 'none';
    scraperSpinner.style.display = 'block';
    scraperProgress.style.display = 'block';

    scraperProgressMessage.innerText = '...';

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

    client.connect(function (err) {
        if (err) {
            console.error(err);

            return;
        }

        client.onUpdate = ({ message, type }) => {
            switch (type) {
                case 'scrapingStart':
                    scraperProgressMessage.innerText = `Now scraping from: ${message}`;
                    break;

                case 'scrapingEnd':
                    scraperProgressMessage.innerText = `Done! ${message.length} news scraped`;
                    break;

                case 'scrapingError':
                    scraperError.style.display = 'block';
                    scraperErrorMessage.innerText = `Oops, an error occurred: ${message} :(`;
                    scraperProgressMessage.innerText = 'Refresh the page and give it another try!';
                    break;

                default:
                    scraperProgressMessage.innerText = message;
            }
        };
    });

    fetch('/scraper', {
        method: 'POST',
        body: directivesBody
    }).then(res => {
        window.location = res.url;
    }).catch(err => {
        console.error(err);

        scraperErrorMessage.innerText = `Something went wrong: ${err}`;
        scraperError.style.display = 'block';
    }).then(() => {
        directiveGroups.forEach(elem => {
            elem.checked = false;
        });

        scraperSpinner.style.display = 'none';
        scraperProgress.style.display = 'none';
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
