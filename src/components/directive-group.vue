<template>
    <section :class="directiveGroupClass">
        <div class="directive-group__control"></div>
        <div class="directive-group__content">
            
            <label class="checkbox">
                <input 
                    class="checkbox__element" 
                    :name="name" 
                    type="checkbox" 
                    :value="name"
                    @change="directiveGroupCheckHandler"
                />
                <span class="checkbox__text">
                    <div class="directive-group__name">
                        {{ name }}
                    </div>
                </span>
            </label>

            <div class="directive-group__description" v-if="description">
                <span v-for="(value, key) in directives">{{ key }}&nbsp;</span>
            </div>
            
            <div :class="directiveGroupCodeClass">
                <span class="directive-group__code__trigger" @click="codeToggleHandler">
                    <span class="link link--pseudo">
                        <icon name="code"></icon>&nbsp;code        
                    </span>
                </span>
                <code class="directive-group__code__content"><pre>{{ directives }}</pre></code>
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
            
            directives: [Array, Object],
            
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
                    'directive-group--is-selected': this.isSelected
                });
            },
            
            directiveGroupCodeClass: function () {
                return cls('directive-group__code', {
                    'directive-group__code--is-opened': this.isCodeOpened
                });
            }
        },
        
        components: {
            icon: Icon
        },
        
        mounted () {
            const _this = this;

            // fixme: change value on selected state change
            this.EventBus.$on('all-deselect', function () {
                _this.EventBus.$emit('directive-group-deselect', _this.id);
                _this.isSelected = false;
            });
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
        }
    }
</script>
