<template>
    <Field v-slot="{ field }"
           v-model="internalValue"
           :name="name"
           type="radio"
           :value="value">
        <input
            :id="fieldId"
            v-bind="{ ...$attrs, ...field }"
            type="radio"
            :name="name"
            :value="value">
        <label :for="fieldId">
            <span v-if="label">{{ label }}</span>
            <span v-else-if="htmlLabel" v-html="htmlLabel"/>
        </label>
        <InputErrorMessage
            v-if="showErrors"
            :name="name"/>
    </Field>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, toRef, watch } from 'vue';
import { Field } from 'vee-validate';
import { CustomInputFieldInternalValue } from '@/core/forms/vee-validate.types';

export default defineComponent({
    name: 'InputRadio',
    components: { Field },
    props: {
        id: {
            type: String,
            required: false,
            default: null,
        },
        name: {
            type: String,
            required: true,
        },
        value: {
            type: [String, Object, Boolean, Number],
            required: false,
            default: '',
        },
        // eslint-disable-next-line vue/require-default-prop
        modelValue: {
            type: null,
        },
        label: {
            type: String,
            default: '',
        },
        htmlLabel: {
            type: String,
            default: '',
        },
        showErrors: {
            type: Boolean,
            default: false,
        },
    },
    emits: {
        'update:modelValue': (value) => true,
    },
    setup(props, { emit }) {
        const internalValue: Ref<CustomInputFieldInternalValue> = ref(null);

        const fieldId = computed(() => {
            return props.id || props.name + Math.random();
        });

        const isModelBound = computed(() => {
            return 'modelValue' in props;
        });

        if (isModelBound.value) {
            const modelValue = toRef(props, 'modelValue');
            watch(modelValue, newModelValue => {
                if (newModelValue !== internalValue.value) {
                    internalValue.value = newModelValue;
                }
            }, { immediate: true });
            watch(internalValue, newInternalValue => {
                emit('update:modelValue', newInternalValue);
            });
        }

        return {
            fieldId,
            internalValue,
        };
    },
});
</script>
