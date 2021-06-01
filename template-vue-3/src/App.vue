<template>
    <router-view/>
    <div class="test">
        <p>
            Vertica Frontend Template
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'App',
    components: {
    },
});
</script>

<style lang="less" scoped>
.test {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    p {
        font-size: 4rem;
    }
}
</style>
