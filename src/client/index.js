/* eslint no-new: 0 */

import Vue from 'vue';
import 'whatwg-fetch';
import Nes from 'nes';

import sourceObjectToArray from '../utils/source-obj-to-array.js';

import VueEvents from './event-bus';

import Button from '../components/button.vue';
import Heading from '../components/heading';
import Icon from '../components/icon.vue';
import Message from '../components/message.vue';
import NewsSection from '../components/news-section.vue';
import Progress from '../components/progress.vue';
import ScraperForm from '../components/scraper-form.vue';
import Sidebar from '../components/sidebar.vue';
import UpdateType from '../components/update-type.vue';

console.info('NewScraper client is up and running!');

const client = new Nes.Client('ws://localhost:9000/scraper/');

// vue app data
const APP_DATA = {
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

    isBusy: false
};

const STORAGE = {
    directives: [],
    directiveGroupsSelected: [],
    directivesSelected: [],

    result: {
        current: {},
        pages: [],
        isHidden: false
    }
};

// event-bus init
Vue.use(VueEvents);

// app init
new Vue({
    el: '.scraper',

    data: {
        data: APP_DATA,
        storage: STORAGE
    },

    components: {
        btn: Button,
        heading: Heading,
        icon: Icon,
        message: Message,
        'news-section': NewsSection,
        'progress-bar': Progress,
        'scraper-form': ScraperForm,
        sidebar: Sidebar,
        'update-type': UpdateType
    },

    created () {
        this.data.isBusy = true;

        this.getDirectives()
            .then(textData => {
                STORAGE.directives = JSON.parse(textData);
            })
            .then(() => {
                this.data.isBusy = false;
            });
    },

    beforeMount () {
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

    mounted () {
        if (this.data.debug) {
            console.debug('application data', this.$data);
        }
    },

    methods: {
        scrapingCancel: function () {
            client.message('scrapingCancel', (err) => {
                if (err) {
                    console.error(err);
                }

                this.data.progress.isHidden = true;
            });
        },

        progressSetup: function () {
            this.data.progress.isHidden = true;
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

        debugToggle: function () {
            this.data.debug = !this.data.debug;

            return this.data.debug && console.debug('application data', this.$data);
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
            this.data.settings = Object.assign(this.data.settings, update);
        },

        directiveGroupSelect: function (id) {
            STORAGE.directives[id].isSelected = true;

            return this.updateSelectedGroups();
        },

        directiveGroupDeSelect: function (id) {
            STORAGE.directives[id].isSelected = false;

            return this.updateSelectedGroups();
        },

        updateSelectedGroups: function () {
            STORAGE.directiveGroupsSelected = STORAGE.directives.filter(item => item.isSelected);
        },

        deselectAll: function () {
            this.EventBus.$emit('all-deselect');
        },

        handleFormSubmit: function () {
            this.data.isBusy = true;

            this.data.error.isHidden = true;
            this.data.progress.isHidden = false;
            this.data.progress.current = this.data.progress.initial;
            this.data.progress.total = this.data.progress.initial;
            this.data.progress.messages = [];

            const directivesBody = new FormData();

            const directiveGroupsData = this.storage.directiveGroupsSelected.reduce(
                (total, item) => {
                    const directives = item.directives;
                    const groupData = sourceObjectToArray(directives);

                    return total.concat(groupData);
                },
                []
            );

            directivesBody.append('directives', JSON.stringify(directiveGroupsData));

            if (this.data.debug) {
                console.debug('directives', this.$data);
                return false;
            }

            directivesBody.append('userCfg', JSON.stringify({
                limit: this.data.settings.limit
            }));

            const directiveGroupsTotal = directiveGroupsData.length;

            this.data.progress.total = directiveGroupsTotal * 2; // showing progress for both start and finish

            client.connect(err => {
                console.log('socket connected!');

                if (err) {
                    console.error('Socket connection error', err);
                }
            });

            client.onUpdate = ({ message, type }) => {
                switch (type) {
                    case 'scrapingStart':
                        this.data.progress.messages.push(`Now scraping from: ${message}`);
                        this.data.progress.current++;
                        break;

                    case 'scrapingEnd':
                        this.data.progress.messages.push(`Done! ${message.length} news scraped`);
                        this.data.progress.current++;
                        break;

                    case 'scrapingAbort':
                        this.data.progress.messages.push(message);
                        break;

                    case 'scrapingError':
                        this.data.error.isHidden = false;
                        this.data.error.value = `Oops, an error occurred: ${message} :(`;
                        this.data.progress.messages.push('Refresh the page and give it another try!');
                        break;

                    default:
                        this.data.progress.messages.push(message);
                }
            };

            fetch('/scraper', {
                method: 'POST',
                body: directivesBody
            }).then(res => {
                // const redirectUrl = res.headers.get('X-Scraping-Redirect');
                // const state = res.headers.get('X-Scraping-State');

                if (this.data.debug) {
                    console.debug('response', res);
                }

                if (res.ok) {
                    this.data.progress.current++;

                    return res.text();
                }
            }).then(textData => {
                const parsedData = JSON.parse(textData);

                if (this.data.debug) {
                    console.debug('result data', parsedData);
                }

                if (parsedData.pages) {
                    STORAGE.result.current = parsedData;
                    STORAGE.result.pages = parsedData.pages;
                }
            }).catch(err => {
                console.error(err);

                this.data.error.isHidden = false;
                this.data.error.value = `Something went wrong: ${err}`;
            }).then(() => {
                client.disconnect();

                this.deselectAll();
                this.data.isBusy = false;
            });
        }
    }
});
