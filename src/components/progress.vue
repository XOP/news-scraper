<template>
    <div class="progress">
        <div class="progress__content">
            <div class="progress__element" v-show="showProgressElement">
                <progress :value="currentValue" :max="totalValue"></progress>
            </div>
            <div :class="messageClass" @click="messageToggle" title="Toggle full scraping log">
                <div class="progress__message__content">
                    <div v-for="message in messages">{{ message }}</div>
                </div>
            </div>
            <div class="progress__feedback" v-show="showFeedback">
                <div class="progress__feedback__item">
                    <a class="link link--inverse" :href="resultsHref" v-if="resultsHref !== ''">
                        To the results
                    </a>
                </div>
                <div class="progress__feedback__item">
                    <button class="button button--secondary button--small" @click.prevent="closeHandler">Close</button>
                </div>
            </div>
        </div>
        <div class="progress__control" v-show="showCancelButton">
            <button class="button" @click.prevent="cancelHandler">Cancel</button>
        </div>
    </div>
</template>

<script>
    import cls from 'classnames';

    export default {
        name: 'progress',
    
        props: {
            currentValue: {
                type: Number,
                default: 1
            },

            totalValue: {
                type: Number,
                default: 50
            },

            messages: {
                type: Array,
                default: []
            },

            resultsHref: {
                type: String,
                default: ''
            }
        },
    
        data () {
            return {
                isMessageExpanded: false
            }
        },
        
        computed: {
            messageClass: function () {
                return cls('progress__message', {
                    'progress__message--is-expanded': this.isMessageExpanded
                });
            },

            showProgressElement: function () {
                return this.totalValue > 2 && this.currentValue <= this.totalValue
            },
            
            showCancelButton: function () {
                return this.totalValue > 2 && this.currentValue < this.totalValue
            },

            showFeedback: function () {
                return this.totalValue > 0 && this.currentValue > this.totalValue
            }
        },
    
        methods: {
            cancelHandler: function () {
                this.EventBus.$emit('progress-abort');
            },

            closeHandler: function () {
                this.EventBus.$emit('progress-close');
            },
            
            messageToggle: function () {
                this.isMessageExpanded = !this.isMessageExpanded;    
            }
        }
    }
</script>
