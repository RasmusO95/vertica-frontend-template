<template>
    <component :is="blockComponent" :model="model" v-bind="$attrs"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BaseBlockViewModel } from '@/types/contentServerContract';
import { blockResolver } from '@/core/content/componentResolver';

export default defineComponent({
    name: 'ContentBlock',
    props: {
        model: {
            type: Object as PropType<BaseBlockViewModel>,
            required: true,
        },
    },
    setup(props) {
        return {
            blockComponent: blockResolver.resolve(props.model.blockType),
        };
    },
});
</script>
