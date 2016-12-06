/* eslint no-new: 0 */

import Vue from 'vue';
import 'whatwg-fetch';
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

const scraperSubmit = $.find('[data-id=scraper-submit]');
const scraperSpinner = $.find('[data-id=scraper-spinner]');
const scraperError = $.find('[data-id=scraper-error]');

const directiveGroups = $.findAll('[data-id=directive-group-check]');

directiveGroups.forEach(elem => {
    elem.addEventListener('change', function () {
        if (validateChecked(directiveGroups)) {
            scraperSubmit.disabled = '';
        } else {
            scraperSubmit.disabled = 'disabled';
        }
    });
});

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

    fetch('/scraper', {
        method: 'POST',
        body: directivesBody
    }).then(res => {
        window.location = res.url;
    }).catch(err => {
        console.error(err);

        $.find('.form__error', scraperError).innerText = `Something went wrong: ${err}`;

        scraperError.style.display = 'block';
        scraperSpinner.style.display = 'none';
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
