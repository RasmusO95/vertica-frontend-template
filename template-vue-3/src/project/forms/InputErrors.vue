<template>
    <div>
        <div v-for="(error, key) in errors" :key="key">
            <span v-if="error.length > 0">{{ error[0] }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'InputErrors',
    props: {
        errors: {
            type: Object as PropType<Record<string, string[]>>,
            required: true,
        },
    },
});
</script>
