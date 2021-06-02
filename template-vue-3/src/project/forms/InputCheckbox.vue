<template>
    <Field v-slot="{ field }"
           v-model="internalValue"
           :name="name"
           :unchecked-value="false"
           type="checkbox"
           :value="value">
        <input
            :id="fieldId"
            v-bind="{ ...$attrs, ...field }"
            type="checkbox"
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
    name: 'InputCheckbox',
    components: { Field },
    props: {
        id: {
            type: String,
            required: false,
            default: null,
        },
        name: {
            type: String,
            default: '',
        },
        value: {
            type: [String, Boolean, Number],
            default: true,
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
            default: true,
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
