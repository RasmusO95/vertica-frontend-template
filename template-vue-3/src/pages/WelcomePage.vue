<template>
    <article class="welcome-page">
        <h1 class="text">Vertica Basic <span class="text-green-500">VUE3</span> Frontend Template</h1>

        <button v-if="!isLoggedIn"
                @click="login"
                class="mt-10 bg-blue-500 rounded font-bold text-white text-15 px-10 py-5">
            Log in
        </button>
        <button v-else
                @click="logout"
                class="mt-10 bg-blue-500 rounded font-bold text-white text-15 px-10 py-5">
            Log out
        </button>

        <p class="mt-5">
            <span class="font-bold">UserData:</span>
            {{ userData }}
        </p>

        <p class="mt-10 text-18 font-bold">
            Template includes:
        </p>

        <ul class="list-disc text-15">
            <li>Authentication (JWT)</li>
            <li>Content blocks</li>
            <li>Http Client Wrapper (axios)</li>
            <li>Http Interceptors (version, redirect, error)</li>
            <li>Http cancellation</li>
            <li>Notifications</li>
            <li>Tailwind</li>
            <li>Dictionary (translations)</li>
            <li>Responsiveness (image, breakpoints etc)</li>
            <li>SVG icons <c-icon name="login"/></li>
            <li>Form utils (vee-validate)</li>
            <li>Basic directives</li>
            <li>Logging</li>
            <li>ES-Lint</li>
        </ul>
    </article>
</template>

<script lang="ts">
import authService from '@/core/auth/auth.service';
import { defineComponent } from 'vue';
import bus from '@/core/bus';
import { ClientMessage, ClientMessageType, ClientMessageWithError, GeneralErrorEventKey } from '@/core/messages/types';

export default defineComponent({
    name: 'WelcomePage',
    computed: {
        isLoggedIn() {
            return authService.isLoggedIn;
        },
        userData() {
            return authService.userData;
        },
    },
    methods: {
        login() {
            authService.logIn('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
        },
        logout() {
            authService.logOut();
        },
    },
    mounted() {
        const messages: ClientMessage[] = [{
            message: 'Welcome - To a Vertica Frontend Vue3 Template',
            messageType: ClientMessageType.Info,
            errorId: '',
        }];
        bus.emit(GeneralErrorEventKey, { messages, errorId: '' } as ClientMessageWithError);
    },
});
</script>

<style scoped>
    .welcome-page {
        height: 100vh;
        @apply flex flex-col justify-center items-center;
    }

    .text {
        font-size: 5rem;
        @apply font-bold;
    }

</style>
