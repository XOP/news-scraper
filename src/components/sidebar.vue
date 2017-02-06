<template>
    <aside :class="sidebarClass">
        <div 
            class="sidebar__open"
            @click="handleOpen"
        >
            <icon name="menu"></icon>
        </div>
        <div class="sidebar__content">
            <div
                class="sidebar__close"
                @click="handleClose"
            >
                <icon name="cross"></icon>
            </div>
            <slot></slot>
        </div>
    </aside>
</template>

<script>
    import Button from './button.vue';
    import Icon from './icon.vue';

    import cls from 'classnames';

    export default {
        name: 'sidebar',

        props: {
            
        },

        data () {
            return {
                isOpened: false
            }
        },

        computed: {
            sidebarClass: function () {
                return cls('sidebar', {
                    'sidebar--is-opened': this.isOpened
                });
            }
        },

        components: {
            btn: Button,
            icon: Icon
        },

        methods: {
            handleOpen: function () {
                this.isOpened = true;
            },
            
            handleClose: function () {
                this.isOpened = false;
            }
        }
    }
</script>
