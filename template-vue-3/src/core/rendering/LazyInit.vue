<template>
    <div ref="root">
        <slot v-if="renderItem" ref="lazyInitItem"/>
        <slot v-else name="lazy-init-placeholder"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, PropType, Ref, ref } from 'vue';
import lazyInitService, { LazyInitRootMargins } from './lazyInit.service';

export default defineComponent({
    name: 'LazyInit',
    props: {
        offset: {
            type: Number as PropType<LazyInitRootMargins>,
            default: 800,
            validator: (value: LazyInitRootMargins) => value === 200 || value === 400 || value === 600 || value === 800 || value === 1000,
        },
        oneTimeRender: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const renderItem: Ref<boolean> = ref(false);
        const root: Ref<Element | null> = ref(null);
        const lazyInitItem: Ref<HTMLElement | null> = ref(null);

        const initialize = (entry) => {
            renderItem.value = true;

            if (props.oneTimeRender) {
                lazyInitService.unObserve(root.value);
            }
        };

        const reset = (entry) => {
            renderItem.value = false;
        };

        onMounted(() => {
            lazyInitService.observe((root.value as Element), props.offset, initialize.bind(this), props.oneTimeRender ? null : reset.bind(this));
        });

        onBeforeUnmount(() => {
            lazyInitService.unObserve(root.value);
        });

        return {
            renderItem,
            root,
            lazyInitItem,
        };
    },
});
</script>
