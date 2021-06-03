<template>
    <transition appear
                enter-active-class="animate__animated animate__fadeIn u-anim-dur-500"
                leave-active-class="animate__animated animate__fadeOut u-anim-dur-500">
        <article v-if="data.messages.length" class="fixed top-0 w-full asdfasdf z-errorToaster animate__animated animate__fadeIn">
            <div v-for="message in data.messages" :key="message.id"
                 class="text-white p-30 font-medium text-16 flex w-full items-center justify-between border border-white"
                 :class="getBgColor(message.messageType)">
                <p>
                    {{ getMessage(message.message) }}
                    <template v-if="message.errorId">
                        [{{ message.errorId }}]
                    </template>
                </p>
                <button class="pl-30">
                    <c-icon name="close" height="18" width="18" class="text-white"
                            @click="clearMessage(message)"/>
                </button>
            </div>
        </article>
    </transition>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { ClientMessage, ClientMessageType, ClientMessageWithError, GeneralErrorEventKey } from '@/core/messages/types';
import bus from '@/core/bus';
import dictionaryService from '@/core/dictionary/dictionary.service';

const AUTO_KILL_TIME = 10000; // ms.

export default defineComponent({
    name: 'ErrorToaster',
    setup() {
        const data: { messages: ClientMessage[] } = reactive({ messages: [] });

        const getBgColor = (messageType: ClientMessageType): string => {
            switch (messageType) {
            case ClientMessageType.Info:
                return 'bg-green-500';
            case ClientMessageType.Warning:
                return 'bg-yellow-500';
            case ClientMessageType.Error:
            default:
                return 'bg-red-500';
            }
        };

        const getMessage = (msgOrLabel: string): string => {
            if (dictionaryService.exists(msgOrLabel)) {
                return dictionaryService.get(msgOrLabel);
            }
            return msgOrLabel;
        };

        const addMessages = (clientMessages: ClientMessageWithError): void => {
            clientMessages.messages.forEach(msg => {
                msg = reactive(msg);
                msg.errorId = clientMessages.errorId;
                setTimeout(() => clearMessage(msg), AUTO_KILL_TIME);
            });
            data.messages = data.messages.concat(clientMessages.messages);
        };

        const clearMessage = (msg: ClientMessage): void => {
            data.messages = data.messages.filter(m => m !== msg);
        };

        bus.on(GeneralErrorEventKey, addMessages);

        return {
            data,
            getBgColor,
            getMessage,
            addMessages,
            clearMessage,
        };
    },
});
</script>
