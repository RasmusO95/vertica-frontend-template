<template>
    <router-view v-slot="{ Component }">
        <transition appear mode="out-in"
                    enter-active-class="animate__animated animate__fadeIn u-anim-dur-250"
                    leave-active-class="animate__animated animate__fadeOut u-anim-dur-150">
            <component :is="Component"/>
        </transition>
    </router-view>

    <ErrorToaster/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ErrorToaster from '@/core/messages/ErrorToaster.vue';

export default defineComponent({
    name: 'App',
    components: {
        ErrorToaster,
    },
});
</script>
