<template>
    <ErrorMessage v-slot="{ message }" :name="name">
        <transition name="o-anim-fade-300" mode="out-in" appear>
            <div v-if="message" :key="message" v-bind="$attrs">
                {{ message }}
            </div>
        </transition>
    </ErrorMessage>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage } from 'vee-validate';

export default defineComponent({
    name: 'InputErrorMessage',
    components: { ErrorMessage },
    props: {
        name: {
            type: String,
            default: '',
        },
    },
});
</script>

<style scoped>
  div {
      color: red;
  }
</style>
