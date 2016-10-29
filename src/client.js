import 'whatwg-fetch';
import * as $ from 'xop-module-utils';

console.log('NewScraper client is up and running!');

const scraperSubmit = $.find('[data-id=scraper-submit]');
const scraperForm = $.find('[data-id=scraper-form]');
const scraperSpinner = $.find('[data-id=scraper-spinner]');

scraperSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();

    scraperSpinner.style.display = 'block';

    fetch('/scraper', {
        method: 'POST',
        body: new FormData(scraperForm)
    }).then(res => {
        window.location = res.url;
    }).catch(err => {
        console.error(err);
    }).always(() => {
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
