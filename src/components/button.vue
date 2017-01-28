<template>
    <button 
        :class="buttonClass" 
        :disabled="disabled"
        :type="type"
    >
        <slot></slot>
    </button>
</template>

<script>
    import cls from 'classnames';

    export default {
        name: 'btn',
 
        props: {
            full: Boolean,
            
            disabled: Boolean,
            
            mode: {
                type: String,
                default: 'primary'
            },

            size: {
                type: String,
                default: 'regular'
            },
            
            type: {
                type: String,
                default: 'button'
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
                    [`button--${this.mode}`]: this.mode,
                    'button--is-disabled': this.disabled
                });
            }
        },
    
        methods: {}
    }
</script>
