import 'whatwg-fetch';
import * as $ from 'xop-module-utils';

import sourceObjectToArray from './utils/source-obj-to-array.js';

console.log('NewScraper client is up and running!');

const scraperSubmit = $.find('[data-id=scraper-submit]');
const scraperSpinner = $.find('[data-id=scraper-spinner]');

scraperSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();

    scraperSpinner.style.display = 'block';

    const directivesBody = new FormData();

    const directiveGroups = $.findAll('[data-id=directive-group-check]').filter(elem => elem.checked);
    const directiveGroupsData = directiveGroups.reduce(
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
