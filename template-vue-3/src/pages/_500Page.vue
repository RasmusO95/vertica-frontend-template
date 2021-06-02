<template>
    <article class="error-page">
        <h1 class="text">500</h1>
    </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: '500Page',
});
</script>

<style scoped>
    .error-page {
        height: 100vh;
        @apply flex justify-center items-center
    }

    .text {
        font-size: 25rem;
        @apply font-bold;
    }

</style>
