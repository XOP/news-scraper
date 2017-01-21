/* eslint no-new: 0 */

import Vue from 'vue';
import 'whatwg-fetch';
import Nes from 'nes';
import * as $ from 'xop-module-utils';

import sourceObjectToArray from './utils/source-obj-to-array.js';

import VueEvents from './event-bus';

import Heading from './components/heading';
import Icon from './components/icon.vue';
import Message from './components/message.vue';
import NewsSection from './components/news-section.vue';
import Progress from './components/progress.vue';
import ScraperForm from './components/scraper-form.vue';
import UpdateType from './components/update-type.vue';

console.log('NewScraper client is up and running!');

const client = new Nes.Client('ws://localhost:9000/scraper/');

// vue app data
const appData = {
    debug: false,

    settings: {
        isHidden: false,
        limit: 0
    },

    error: {
        isHidden: true,
        value: ''
    },

    form: {

    },

    progress: {
        messages: [],
        initial: 0,
        current: 0,
        total: 0,
        resultsHref: '',
        isHidden: true
    },

    result: {
        current: {},
        pages: [],
        isHidden: true
    },

    isBusy: false,

    directives: [],
    directiveGroupsSelected: [],
    directivesSelected: []
};

// event-bus init
Vue.use(VueEvents);

// app init
const app = new Vue({
    el: '.scraper',

    data: appData,

    components: {
        heading: Heading,
        icon: Icon,
        message: Message,
        'news-section': NewsSection,
        'progress-bar': Progress,
        'scraper-form': ScraperForm,
        'update-type': UpdateType
    },

    created () {
        this.isBusy = true;

        this.getDirectives()
            .then(textData => {
                this.directives = JSON.parse(textData);
            })
            .then(() => {
                this.isBusy = false;
            });
    },

    mounted () {
        const _this = this;

        this.EventBus.$on('progress-abort', this.scrapingCancel);
        this.EventBus.$on('progress-close', this.progressSetup);

        this.EventBus.$on('form-submit', this.handleFormSubmit);

        // storage operations
        this.EventBus.$on('directive-group-select', this.directiveGroupSelect);
        this.EventBus.$on('directive-group-deselect', this.directiveGroupDeSelect);

        // settings
        this.EventBus.$on('settings-update-limit', (limit) => {
            _this.handleSettingsUpdate({ limit });
        });
    },

    methods: {
        scrapingCancel: function () {
            client.message('scrapingCancel', (err) => {
                if (err) {
                    console.error(err);
                }

                appData.progress.isHidden = true;
            });
        },

        progressSetup: function () {
            appData.progress.isHidden = true;
        },

        getDirectives: function () {
            return fetch('/scraper/directives', {
                method: 'POST'
            }).then(res => {
                if (res.ok) {
                    return res.text();
                }
            }).catch(err => {
                console.error(err);
            });
        },

        debugSaveData: function () {
            return false;
        },

        debugLoadData: function () {
            return false;
        },

        debugClearData: function () {
            return false;
        },

        handleSettingsUpdate: function (update) {
            app.$data.settings = Object.assign(app.$data.settings, update);
        },

        directiveGroupSelect: function (id) {
            this.directives[id].isSelected = true;

            return this.updateSelectedGroups();
        },

        directiveGroupDeSelect: function (id) {
            this.directives[id].isSelected = false;

            return this.updateSelectedGroups();
        },

        updateSelectedGroups: function () {
            this.directiveGroupsSelected = this.directives.filter(item => item.isSelected);
        },

        deselectAll: function () {
            this.EventBus.$emit('all-deselect');
        },

        handleFormSubmit: function () {
            app.$data.isBusy = true;

            appData.error.isHidden = true;
            appData.progress.isHidden = false;
            appData.progress.current = appData.progress.initial;
            appData.progress.total = appData.progress.initial;
            appData.progress.messages = [];

            const directivesBody = new FormData();

            const directiveGroups = $.findAll('.directive-group input[type=checkbox]');
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

            directivesBody.append('userCfg', JSON.stringify({
                limit: app.$data.settings.limit
            }));

            const directiveGroupsTotal = directiveGroupsData.length;

            appData.progress.total = directiveGroupsTotal * 2; // showing progress for both start and finish

            client.connect(err => {
                console.log('connect');

                if (err) {
                    console.error('Socket connection error', err);
                }
            });

            client.onUpdate = ({ message, type }) => {
                switch (type) {
                    case 'scrapingStart':
                        appData.progress.messages.push(`Now scraping from: ${message}`);
                        appData.progress.current++;
                        break;

                    case 'scrapingEnd':
                        appData.progress.messages.push(`Done! ${message.length} news scraped`);
                        appData.progress.current++;
                        break;

                    case 'scrapingAbort':
                        appData.progress.messages.push(message);
                        break;

                    case 'scrapingError':
                        appData.error.isHidden = false;
                        appData.error.value = `Oops, an error occurred: ${message} :(`;
                        appData.progress.messages.push('Refresh the page and give it another try!');
                        break;

                    default:
                        appData.progress.messages.push(message);
                }
            };

            fetch('/scraper', {
                method: 'POST',
                body: directivesBody
            }).then(res => {
                const redirectUrl = res.headers.get('X-Scraping-Redirect');

                // const state = res.headers.get('X-Scraping-State');

                if (res.ok) {
                    appData.progress.current++;

                    if (redirectUrl) {
                        appData.progress.resultsHref = redirectUrl;
                    }

                    return res.text();
                }
            }).then(textData => {
                const parsedData = JSON.parse(textData);

                console.log('data', parsedData);

                if (parsedData.pages) {
                    appData.result.current = parsedData;
                    appData.result.pages = parsedData.pages;
                }
            }).catch(err => {
                console.error(err);

                appData.error.isHidden = false;
                appData.error.value = `Something went wrong: ${err}`;
            }).then(() => {
                client.disconnect();

                app.deselectAll();
                app.$data.isBusy = false;
            });
        }
    }
});
