<template>
    <ContentBlockList :blocks="model.blocks"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ContentBlockList from '@/core/content/ContentBlockList.vue';
import { ContentPageViewModel } from '@/types/contentServerContract';

export default defineComponent({
    name: 'ContentPage',
    components: { ContentBlockList },
    props: {
        model: {
            type: Object as PropType<ContentPageViewModel>,
            required: true,
        },
    },
});
</script>
