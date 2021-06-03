<template>
    <div v-if="messages.length > 0">
        <slot :messages="messages">
            <ul class="text-red-500 text-12 font-medium list-reset">
                <li v-for="(message, ix) in messages" :key="ix" class="mt-15">
                    {{ getMessage(message.message) }}
                    <template v-if="errorId">
                        [ {{ errorId }}]
                    </template>
                </li>
            </ul>
        </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, reactive, ref } from 'vue';
import bus from '@/core/bus';
import { ClientMessage, ValidationErrorEvent, ValidationErrorEventKey } from '@/core/messages/types';
import dictionaryService from '@/core/translation/dictionary.service';

export default defineComponent({
    name: 'WebApiMessage',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const data: { messages: ClientMessage[] } = reactive({ messages: [] });
        const errorId = ref('');

        const getMessage = (msgOrLabel: string): string => {
            if (dictionaryService.exists(msgOrLabel)) {
                return dictionaryService.get(msgOrLabel);
            }
            return msgOrLabel;
        };

        const onMessages = (validationErrorEvent: ValidationErrorEvent) => {
            if (validationErrorEvent.messagesId === props.id) {
                data.messages = validationErrorEvent.messages;
                errorId.value = validationErrorEvent.errorId;
                validationErrorEvent.handled();
            }
        };

        bus.on(ValidationErrorEventKey, onMessages);

        onBeforeUnmount(() => {
            bus.off(ValidationErrorEventKey, onMessages);
        });

        return {
            data,
            errorId,
            getMessage,
        };
    },
});
</script>
