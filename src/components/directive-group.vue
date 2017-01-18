<template>
    <section :class="directiveGroupClass">
        <div class="directive-group__control"></div>
        <div class="directive-group__content">
            
            <label class="checkbox">
                <input 
                    class="checkbox__element" 
                    :name="name" 
                    type="checkbox" 
                    :value="directives"
                    @change="directiveGroupCheckHandler"
                />
                <span class="checkbox__text">
                    <div class="directive-group__name">
                        {{ name }}
                    </div>
                </span>
            </label>

            <div class="directive-group__description" v-if="description">
                {{ description }}
            </div>
            
            <div :class="directiveGroupCodeClass">
                <span class="directive-group__code__trigger" @click="codeToggleHandler">
                    
                    <span class="link link--pseudo">
                        <icon name="layers"></icon>&nbsp;code        
                    </span>
                    
                </span>
                <code class="directive-group__code__content">
                    {{ directivesFormatted }}
                </code>
            </div>
        </div>
    </section>
</template>

<script>
    import Icon from './icon.vue';
    
    import cls from 'classnames';

    export default {
        name: 'directive-group',
    
        props: {
            description: {
                type: String
            },
            
            directives: [String, Array, Object],
            
            id: [Number, String],
            
            name: {
                type: String,
                required: true
            }
        },
    
        data () {
            return {
                isCodeOpened: false,
                
                isSelected: false,
            }
        },
        
        computed: {
            directiveGroupClass: function () {
                return cls('directive-group', {

                });
            },
            
            directiveGroupCodeClass: function () {
                return cls('directive-group__code', {
                    'directive-group__code--is-opened': this.isCodeOpened
                });
            },
            
            directivesFormatted: function () {
                return this.directives;
            }
        },
    
        methods: {
            codeToggleHandler: function () {
                this.isCodeOpened = !this.isCodeOpened
            },
            
            directiveGroupCheckHandler: function (e) {
                const isChecked = e.target.checked;
                
                if (isChecked) {
                    this.EventBus.$emit('directive-group-select', this.id);
                    this.isSelected = true;
                } else {
                    this.EventBus.$emit('directive-group-deselect', this.id);
                    this.isSelected = false;
                }
            }
        },
        
        components: {
            icon: Icon
        },
        
        created: function () {
            this.EventBus.$on('all-deselect', function () {
                this.isSelected = false; 
            });
        }
    }
</script>
