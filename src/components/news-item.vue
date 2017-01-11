<template>
    <article class="news-item">
        <a class="news-item__link" :href="href" :title="title" target="_blank">
            <figure
                v-if="imageUrl"
                class="news-item__image"
                :style="imageUrl"
            >
            </figure>
            <div class="news-item__main">
                <div class="news-item__date" v-if="time">{{time}}</div>
                <div class="news-item__heading">
                    <heading :level="3">
                        {{text}}
                    </heading>
                </div>
                <div class="news-item__author" v-if="author">{{author}}</div>
            </div>
        </a>
    </article>
</template>

<script>
    import Heading from './heading';

    export default {
        name: 'news-item',
    
        props: {
            author: {
                type: String
            },

            href: {
                type: String,
                required: true
            },
            
            imageSrc: {
                type: String
            },
            
            text: {
                type: String,
                required: true
            },

            time: {
                type: String
            },

            title: {
                type: String,
                required: true
            }
        },
    
        data () {
            return {}
        },
        
        computed: {
            imageUrl: function () {
                return this.imageSrc ? `background-image: url(${this.imageSrc})` : null
            }
        },
    
        methods: {},
        
        components: {
            heading: Heading
        }
    }
</script>
