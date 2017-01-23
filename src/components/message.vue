<template>
    <section :class="messageClass">
        <span class="message__icon" v-if="iconName">
            <icon :name="iconName" />
        </span>
        <span class="message__content">
            <slot></slot>
        </span>
    </section>
</template>

<script>
    import Icon from './icon.vue';
    
    import cls from 'classnames';

    export default {
        name: 'message',
    
        props: {
            icon: [Boolean, String],
            type: {
                type: String
            }
        },
    
        data () {
            return {}
        },
        
        computed: {
            iconName: function () {
                let name = null;
                
                switch (this.type) {
                    case 'error':
                        name = 'warning';
                        break;
                    
                    case 'info':
                        name = 'pointer-right';
                        break;
                    
                    case 'success':
                        name = 'checkmark-circle';
                        break;
                }
                
                return Boolean(this.icon) && ( typeof this.icon === 'string' ? this.icon : name );
            },

            messageClass: function () {
                return cls('message', {
                    [`message--${this.type}`]: this.type
                });
            }
        },

        components: {
            icon: Icon
        },

        methods: {}
    }
</script>
