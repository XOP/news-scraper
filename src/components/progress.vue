<template>
    <div class="progress">
        <div class="progress__content">
            <div class="progress__element">
                <progress :value="currentValue" :max="totalValue"></progress>
            </div>
            <div class="progress__message">{{ message }}</div>
        </div>
        <div class="progress__control">
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
            }
        },
    
        data () {
            return {}
        },
        
        computed: {},
    
        methods: {
            cancelHandler: function () {
                this.$emit('progress-abort');
            }
        }
    }
</script>
