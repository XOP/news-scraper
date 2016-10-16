import * as $ from 'xop-module-utils';

console.log('up and running!');

// const scraperInput = $.find('[data-id=scraper-input]');

const scraperForm = $.find('[data-id=scraper-form]');
const scraperSubmit = $.find('[data-id=scraper-submit]');
const scraperSpinner = $.find('[data-id=scraper-spinner]');

scraperForm.onsubmit = () => {
    scraperSubmit.style.display = 'none';
    scraperSpinner.style.display = 'block';
};
