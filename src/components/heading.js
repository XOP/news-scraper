const Heading = {
    render: function (createElement) {
        const tagName = this.tag === 'h' ? `${this.tag}${this.level}` : this.tag;

        return createElement(
            tagName,
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
            default: 'h'
        },

        level: {
            type: Number,
            required: true
        }
    }
};

export default Heading;
