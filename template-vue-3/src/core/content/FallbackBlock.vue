<template>
    <article class="fallback">
        <h2>Fallback block - did not find block-type: <b>{{ type }}</b></h2>
        <pre>{{ jsonContent }}</pre>
    </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FallbackBlock',
    props: {
        model: {
            required: true,
            type: Object,
        },
        type: {
            required: true,
            type: String,
        },
    },
    setup(props) {
        return {
            jsonContent: JSON.stringify(props.model),
        };
    },
});
</script>

<style scoped>
.fallback {
    min-height: 20vh;
    border: 1px dashed black;
    background-color: rgba(255, 60, 0, 0.6);
    padding: 10px;
    overflow: hidden;
}
</style>
