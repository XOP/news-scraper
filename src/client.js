import * as $ from 'xop-module-utils';

console.log('up and running!');

// const scraperSubmit = $.find('[data-id=scraper-submit]');
// const scraperInput = $.find('[data-id=scraper-input]');

const scraperForm = $.find('[data-id=scraper-form]');
const scraperSpinner = $.find('[data-id=scraper-spinner]');

scraperForm.onsubmit = () => {
    scraperSpinner.style.display = 'block';
};
