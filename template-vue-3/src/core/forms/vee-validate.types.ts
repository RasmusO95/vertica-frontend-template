// Types not exported in vee-validate
export interface FieldContext {
    field: string;
    value: any;
    form: Record<string, any>;
    rule?: {
        name: string;
        params?: Record<string, any> | any[];
    };
}

// Not exact, but good enough
export type ValidationRuleFunction = (value: any, ...rest: any) => boolean | string | Promise<boolean | string>;

export interface ValidationRule {
    validator: ValidationRuleFunction;
    label: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type CustomInputFieldInternalValue = string | object | number | boolean | null;
