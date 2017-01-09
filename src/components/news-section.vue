<template>
    <section class="news-section">
        <div class="news-section__heading">
            {{ title }}
        </div>
        <div class="news-section__url">{{ url }}</div>
        <div class="news-section__content" v-show="false">
            
        </div>
    </section>
</template>

<script>
    import cls from 'classnames';

    export default {
        name: 'news-section',
    
        props: {
            data: {
                type: Array,
                default: []
            },

            title: {
                type: String
            },
            
            url: {
                type: String
            }
        },
    
        data () {
            return {}
        },
        
        computed: {},
    
        methods: {}
    }
</script>
