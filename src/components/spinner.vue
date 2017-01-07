<template>
    <div :class="spinnerClass">
        <div class="spinner__element"></div>
    </div>
</template>

<script>
    import cls from 'classnames';

    export default {
        name: 'spinner',
 
        props: {
            inline: {
                type: Boolean,
                default: false
            },

            isActive: {
                type: Boolean,
                default: false
            },

            screen: {
                type: Boolean,
                default: false
            },
        },
    
        data () {
            return {}
        },
        
        computed: {
            spinnerClass: function () {
                return cls('spinner', {
                    'spinner--is-active': this.isActive,
                    'spinner--inline': this.inline,
                    'spinner--screen': this.screen
                });
            }
        },
    
        methods: {}
    }
</script>
