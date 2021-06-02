import { defineRule, configure } from 'vee-validate';
// eslint-disable-next-line camelcase
import { required, email, min, max, min_value, between } from '@vee-validate/rules';
import { FieldContext, ValidationRule } from '@/core/forms/vee-validate.types';

const rules: Record<string, ValidationRule> = {
    required: {
        validator: required,
        label: '[required fejl label]',
    },
    email: {
        validator: email,
        label: '[email fejl label]',
    },
    min: {
        validator: min,
        label: '[min fejl label]',
    },
    'min-value': {
        validator: min_value,
        label: '[min-value fejl label]',
    },
    between: {
        validator: between,
        label: '[between fejl label]',
    },
    max: {
        validator: max,
        label: '[max fejl label]',
    },
};

configure({
    generateMessage,
});

setupRules();

function setupRules(): void {
    Object.keys(rules).forEach((id: string) => {
        const validator = rules[id].validator;
        defineRule(id, validator);
    });
}

function generateMessage(context: FieldContext): string {
    if (!context.rule) {
        throw new Error(`Validation-error but no rules: ${context.field}`);
    }

    const labelKey = rules[context.rule.name].label;
    const params: string[] = [];
    if (context.rule.params) {
        // Can be array or object with key/values - e.g. { min: xx, max: yy }. Convert to array always.
        params.push(...Array.isArray(context.rule.params) ? context.rule.params : Object.values(context.rule.params));
    }
    return translate(labelKey, context.field, params);
}

function translate(label: string, field: string, params: string[]): string {
    return `${label}. Field: ${field}. Params: ${params.join('/')}`;
}
