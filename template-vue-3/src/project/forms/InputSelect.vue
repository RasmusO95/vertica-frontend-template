<template>
    <div class="relative w-full">
        <Field
            v-slot="{ field }"
            v-model="internalValue"
            :name="name"
            :value="value"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="handleChange">
            <select
                :id="fieldId"
                v-prohibit-zoom
                :name="name"
                :value="value"
                v-bind="{ ...fieldAttrs, ...field }">
                <slot/>
            </select>
            <label v-if="label" :for="fieldId">
                {{ label }}
            </label>
            <label v-if="isFocused" :for="fieldId"></label>
        </Field>
    </div>
    <InputErrorMessage
        v-if="showErrors"
        :name="name"/>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, toRef, watch } from 'vue';
import { Field } from 'vee-validate';
import { CustomInputFieldInternalValue } from '@/core/forms/vee-validate.types';

export default defineComponent({
    name: 'InputSelect',
    components: { Field },
    props: {
        id: {
            type: String,
            required: false,
            default: null,
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
        name: {
            type: String,
            required: true,
        },
        showErrors: {
            type: Boolean,
            required: false,
            default: true,
        },
        label: {
            type: String,
            required: true,
        },
    },
    emits: {
        'update:modelValue': (value) => true,
    },
    setup(props, { attrs, emit }) {
        const internalValue: Ref<CustomInputFieldInternalValue> = ref(null);
        const isFocused: Ref<boolean> = ref(false);

        const isModelBound = computed(() => {
            return 'modelValue' in props;
        });

        const fieldId = computed(() => {
            return props.id || props.name + new Date().valueOf();
        });

        const fieldAttrs = computed(() => {
            const fieldAttrs = {
                ...attrs,
                class: '',
            };
            return fieldAttrs;
        });

        const handleChange = (evt) => {
            let value = internalValue.value;
            if (value === 'true') {
                value = true;
            } else if (value === 'false') {
                value = false;
            }
            emit('update:modelValue', value);
        };

        internalValue.value = (isModelBound.value ? props.modelValue : props.value) as CustomInputFieldInternalValue;

        if (isModelBound.value) {
            const modelValue = toRef(props, 'modelValue');
            watch(modelValue, newModelValue => {
                if (newModelValue !== internalValue.value) {
                    internalValue.value = newModelValue;
                }
            });
        }

        return {
            isFocused,
            fieldId,
            fieldAttrs,
            internalValue,
            handleChange,
        };
    },
});

</script>
