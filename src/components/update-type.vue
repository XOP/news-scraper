<template>
    <div class="update-type">
        <div class="update-type__heading">
            I read 
        </div>
        
        <div class="update-type__control">
            <input type="hidden" v-model="typeValue" data-id="update-type-value" />
            <select class="update-type__select" v-model="selected">
                <option value="month">Monthly</option>
                <option value="week">Weekly</option>
                <option value="day">Daily</option>
            </select>
        </div>
    </div>
</template>

<script>
    export default {
        props: [

        ],
    
        data () {
            return {
                selected: 'week',
                types: {
                    month: {
                        label: 'Monthly',
                        value: 10
                    },
                    week: {
                        label: 'Weekly',
                        value: 3
                    },
                    day: {
                        label: 'Daily',
                        value: 1
                    },
                }
            }
        },
        
        computed: {
            typeLabel: function () {
                return this.types[this.selected]['label'];
            },
            typeValue: function () {
                return this.types[this.selected]['value'];
            }
        },
    
        methods: {

        }
    }
</script>
