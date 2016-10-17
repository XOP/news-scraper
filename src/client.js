import 'whatwg-fetch';
import * as $ from 'xop-module-utils';

console.log('up and running!');

// const scraperInput = $.find('[data-id=scraper-input]');

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
