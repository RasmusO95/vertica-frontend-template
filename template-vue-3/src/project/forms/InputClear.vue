<template>
    <transition name="o-anim-fade-300">
        <a v-if="active" key="clear" tabindex="-1" @click.prevent="clear()">
            <CIcon name="icon-close-round" width="13" height="13"
                   :original="true"/>
        </a>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'InputClear',
    props: {
        active: {
            type: Boolean,
            default: true,
        },
    },
    emits: {
        clear: () => true,
    },
    setup(props, { emit }) {
        const clear = (): void => {
            emit('clear');
        };
        return {
            clear,
        };
    },
});
</script>
