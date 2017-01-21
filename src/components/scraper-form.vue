<template>
    <section class="scraper-form">

        <form 
            class="form" 
            action="/scraper" 
            method="post"
            v-if="directives.length"
            @submit.prevent="handleSubmit"
        >
            <div class="form__row">
                <directive-group
                    v-for="(group, idx) in directives"
                    :description="group.description"
                    :directives="group.directives"
                    :id="idx"
                    :name="group.name"
                ></directive-group>
            </div>
            <div class="form__row">
                <input 
                    type="submit"
                    :disabled="isDisabled" 
                    value="Get news!"
                />
            </div>
        </form>
        
        <message
            icon="sad"
            v-if="directives.length === 0"
        >
            No directives :(
        </message>

        <spinner :is-active="isBusy" :screen="true"></spinner>
    </section>
</template>

<script>
    import DirectiveGroup from './directive-group.vue';
    import Message from './message.vue';
    import Spinner from './spinner.vue';

    import cls from 'classnames';

    export default {
        name: 'scraper-form',
    
        props: {
            directives: {
                type: Array,
                default: function () {
                    return [];
                }
            },

            directiveGroupsSelected: {
                type: Array,
                default: function () {
                    return [];
                }
            },      

            directivesSelected: {
                type: Array,
                default: function () {
                    return [];
                }
            },

            isBusy: {
                type: Boolean
            }
        },
    
        data () {
            return {
            
            }
        },
        
        computed: {
            isDisabled: function () {
                return this.directiveGroupsSelected.length === 0 ? 'disabled' : false;
            }
        },
    
        methods: {
            handleSubmit: function () {
                this.EventBus.$emit('form-submit');
            }
        },
        
        components: {
            'directive-group': DirectiveGroup,
            message: Message,
            spinner: Spinner
        }
    }
</script>
