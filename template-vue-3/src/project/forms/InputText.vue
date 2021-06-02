<template>
    <div :class="[$attrs.class]">
        <input
            :id="fieldId"
            ref="inputField"
            v-autofocus="autofocus"
            v-prohibit-zoom
            v-bind="fieldAttrs"
            :name="name"
            :type="type"
            :value="inputValue"
            v-on="validationListeners"
            @focus="isFocused = true"
            @blur="isFocused = false">
        <label v-if="isSearchType" :for="fieldId">
            <CIcon name="icon-search"
                   width="16"
                   height="16"/>
        </label>
        <label :for="fieldId">{{ label }}</label>
        <InputClear v-if="inputClear" :active="showInputClear" @clear="handleClear"/>
        <InputErrorMessage
            v-if="showErrors"
            :name="name"/>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, toRef, watch } from 'vue';
import { useField } from 'vee-validate';

export default defineComponent({
    name: 'InputText',
    inheritAttrs: false,
    props: {
        type: {
            type: String,
            default: 'text',
        },
        value: {
            type: [String, Number],
            default: '',
        },
        // eslint-disable-next-line vue/require-default-prop
        modelValue: {
            type: null,
        },
        name: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            required: false,
            default: null,
        },
        autofocus: {
            type: Boolean,
            required: false,
            default: false,
        },
        showErrors: {
            type: Boolean,
            required: false,
            default: true,
        },
        inputClear: {
            type: Boolean,
            required: false,
            default: true,
        },
        fieldDisplayName: {
            type: String,
            required: false,
            default: '',
        },
        validationBehaviour: {
            type: String,
            default: 'eager',
            validate: (value: string): boolean => ['aggressive', 'eager'].includes(value),
        },
    },
    emits: {
        clear: () => true,
        input: () => true,
        'update:modelValue': (value) => true,
    },
    setup(props, { attrs, emit }) {
        const isFocused: Ref<boolean> = ref(false);

        const isModelBound = computed(() => {
            return 'modelValue' in props;
        });

        const {
            value: inputValue,
            errorMessage,
            handleChange,
            handleBlur,
            handleInput,
            validate,
            resetField,
        } = useField(props.name, undefined, {
            initialValue: isModelBound.value ? props.modelValue : props.value,
            validateOnValueUpdate: false,
            label: props.fieldDisplayName || props.label,
        });

        const fieldId = computed(() => {
            return props.id || props.name + Math.random();
        });

        const isSearchType = computed(() => {
            return props.type === 'search';
        });

        const fieldAttrs = computed(() => {
            const fieldAttrs = {
                ...attrs,
                class: '',
            };
            return fieldAttrs;
        });

        const showInputClear = computed(() => {
            return isFocused.value && !!inputValue.value;
        });

        const handleClear = () => {
            resetField();
            isModelBound.value && emit('update:modelValue', inputValue.value);
            emit('clear');
        };

        const handleInputEvent = (evt) => {
            isModelBound.value && emit('update:modelValue', evt.target.value);
            emit('input', evt);
            handleInput(evt);
        };

        const handleChangeEvent = (evt) => {
            if (evt) {
                isModelBound.value && emit('update:modelValue', evt.target.value);
                emit('input', evt);
                handleChange(evt);
            }
        };

        const validationListeners = computed(() => {
            // if no current errors use lazy validation handlers
            const listeners = {
                blur: handleBlur,
                change: handleChangeEvent,
                input: handleInputEvent,
            };

            // if aggressive mode or current errors, replace with eager handlers to validate changes immediately
            if (props.validationBehaviour === 'aggressive' || errorMessage.value) {
                listeners.blur = handleChangeEvent;
                listeners.input = handleChangeEvent;
            }

            return listeners;
        });

        if (isModelBound.value) {
            const modelValue = toRef(props, 'modelValue');
            watch(modelValue, newModelValue => {
                if (newModelValue !== inputValue.value) {
                    inputValue.value = newModelValue;
                    validate();
                }
            });
        }

        return {
            validationListeners,
            errorMessage,
            inputValue,
            fieldId,
            isSearchType,
            handleClear,
            showInputClear,
            isFocused,
            fieldAttrs,
        };
    },
});
</script>
