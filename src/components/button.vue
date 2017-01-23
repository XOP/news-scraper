<template>
    <button :class="buttonClass">
        <slot></slot>
    </button>
</template>

<script>
    import cls from 'classnames';

    export default {
        name: 'btn',
 
        props: {
            full: Boolean,
            
            isDisabled: Boolean,
            
            type: {
                type: String,
                default: 'primary'
            },

            size: {
                type: String,
                default: 'regular'
            }
        },
    
        data () {
            return {}
        },
        
        computed: {
            buttonClass: function () {
                return cls('button', {
                    'button--full': this.full,
                    [`button--${this.size}`]: this.size,
                    [`button--${this.type}`]: this.type,
                    'button--is-disabled': this.isDisabled
                });
            }
        },
    
        methods: {}
    }
</script>
