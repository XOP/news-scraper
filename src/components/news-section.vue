<template>
    <section class="news-section">
        <div class="news-section__heading">
            <heading :level="2">
                {{ title }}
            </heading>
        </div>
        <div class="news-section__url">{{ url }}</div>
        <div class="news-section__news">
            <div class="news-section__news__content" v-show="!news.length">
                <spinner></spinner>
            </div>
            <div class="news-section__news__content" v-show="news.length">
                <news-item 
                    v-for="item in news"
                    :href="item.href"
                    :title="item.title"
                    :text="item.text"
                    :author="item.author"
                    :time="item.time"
                    :image-src="item.imageSrc"
                >
                </news-item>
            </div>
        </div>
    </section>
</template>

<script>
    import cls from 'classnames';
    
    import Heading from './heading';
    import NewsItem from './news-item.vue';
    import Spinner from './spinner.vue';

    export default {
        name: 'news-section',
    
        props: {
            news: {
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

        components: {
            heading: Heading,
            'news-item': NewsItem,
            spinner: Spinner
        },

        methods: {}
    }
</script>
