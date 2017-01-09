const Heading = {
    render: function (createElement) {
        return createElement(
            `${this.tag}${this.level}`,
            {
                attrs: {
                    class: `heading heading--${this.level}`
                }
            },
            this.$slots.default
        );
    },

    props: {
        tag: {
            type: String,
            default: 'div'
        },

        level: {
            type: Number,
            required: true
        }
    }
};

export default Heading;
