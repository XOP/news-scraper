<template>
    <span :class="iconClass"></span>
</template>

<script>
    import cls from 'classnames';

    export default {
        name: 'icon',
 
        props: {
            name: {
                type: String,
                default: 'star'
            },

            size: {
                type: String
            }
        },
    
        data () {
            return {}
        },
        
        computed: {
            iconClass: function () {
                return cls('icon', {
                    [`icon--${this.name}`]: this.name
                });
            }
        },
    
        methods: {}
    }
</script>
