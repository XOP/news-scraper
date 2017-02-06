<template>
    <section class="scraper-form">

        <div class="scraper-form__form">
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
                    <div class="scraper-form__submit">
                        <btn
                            :disabled="isDisabled"
                            :full="true"
                            size="big"
                            type="submit"
                        >
                            Get news!
                        </btn>
                    </div>
                </div>
            </form>
        </div>

        <div class="scraper-form__empty">
            <message
                icon="sad"
                v-if="directives.length === 0"
            >
                No directives
            </message>
        </div>

        <spinner :is-active="isBusy" :screen="true"></spinner>
    </section>
</template>

<script>
    import Button from './button.vue';
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

        components: {
            btn: Button,
            'directive-group': DirectiveGroup,
            message: Message,
            spinner: Spinner
        },

        methods: {
            handleSubmit: function () {
                this.EventBus.$emit('form-submit');
            }
        }
    }
</script>
