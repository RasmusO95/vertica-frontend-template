<script lang="ts">
import { defineComponent, h } from 'vue';

export default defineComponent({
    name: 'SmartHeading',
    props: {
        renderAs: {
            default: 'h2',
            type: String,
            validator: (value: string) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value),
        },
        styleClass: {
            default: 'h1',
            type: String,
        },
    },
    setup(props, { slots }) {
        return () => h(props.renderAs, { class: props.styleClass }, slots);
    },
});
</script>
