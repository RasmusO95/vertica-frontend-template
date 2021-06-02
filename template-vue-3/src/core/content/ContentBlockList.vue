<template>
    <article>
        <ContentBlock v-for="(block, ix) in blocks" :key="ix"
                      :model="block"
                      :is-first-block="ix === 0"/>
    </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BaseBlockViewModel } from '@/types/contentServerContract';
import ContentBlock from './ContentBlock.vue';

export default defineComponent({
    name: 'ContentBlockList',
    components: { ContentBlock },
    props: {
        blocks: {
            type: Array as PropType<BaseBlockViewModel[]>,
            default: () => [],
        },
    },
});
</script>
