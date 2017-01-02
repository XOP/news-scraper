<template>
    <div class="progress">
        <div class="progress__content">
            <div class="progress__element" v-show="showProgressElement">
                <progress :value="currentValue" :max="totalValue"></progress>
            </div>
            <div class="progress__message">{{ message }}</div>
            <div class="progress__feedback" v-if="currentValue > totalValue">
                <div class="progress__feedback__item">
                    <a class="link link--inverse" :href="resultsHref">
                        To the results
                    </a>
                </div>
                <div class="progress__feedback__item">
                    <button class="button button--secondary button--small" @click.prevent="closeHandler">Close</button>
                </div>
            </div>
        </div>
        <div class="progress__control" v-if="currentValue < totalValue">
            <button class="button" @click.prevent="cancelHandler">Cancel</button>
        </div>
    </div>
</template>

<script>
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
            message: {
                type: String,
                default: '...'
            },
            resultsHref: {
                type: String
            }
        },
    
        data () {
            return {}
        },
        
        computed: {
            showProgressElement: function () {
                return this.totalValue > 2 && this.currentValue <= this.totalValue
            }
        },
    
        methods: {
            cancelHandler: function () {
                this.$emit('progress-abort');
            },
            closeHandler: function () {
                this.$emit('progress-close');
            }
        }
    }
</script>
