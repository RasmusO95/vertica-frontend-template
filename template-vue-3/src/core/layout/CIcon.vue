<template>
    <vue-svgicon role="img"
                 class="c-icon-icon c-icon-fill"
                 :data="data"
                 :title="screenReaderFriendlyTitle"
                 v-bind="$attrs"/>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue';

export default defineComponent({
    name: 'CIcon',
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const nameProp = toRef(props, 'name');
        const screenReaderFriendlyTitle = computed(() => {
            return nameProp.value.replace(/-/g, ' ');
        });
        const data = import.meta.globEager(`/assets/icons/${props.name}.svg`);
        return { screenReaderFriendlyTitle, data };
    },
});
</script>
