import { useForm } from 'vee-validate';

export type IValidationSchema<T> = {
    [P in keyof T]?: ((value: T[P]) => boolean) | string | Record<string, unknown>
}

export function useTypedForm<T>(
    config: {
        initialValues: T,
        validationSchema: IValidationSchema<T>,
        handleSubmit: (values: T) => void,
    },
): { onSubmit: (e?: Event) => Promise<void> } {
    const { handleSubmit } = useForm<T>(config as any);
    const onSubmit = handleSubmit((values) => {
        config.handleSubmit(typifySubmitResult(values, config.initialValues));
    });

    return { onSubmit };
}

type ISubmitResult<T> = {
    [P in keyof T]: any;
}

function typifySubmitResult<T>(values: ISubmitResult<T>, model: T) : T {
    const convert = {
        string: ensureString,
        number: ensureNumber,
        boolean: ensureBoolean,
    };

    const result = { ...model };
    Object.keys(model).forEach(key => {
        result[key] = convert[typeof model[key]](values[key]);
    });
    return result;
}

function ensureNumber(value: string | number): number {
    return typeof value === 'number' ? value : parseFloat(value);
}

function ensureString(value: string | number): string {
    return typeof value === 'string' ? value : value.toString();
}

function ensureBoolean(value: string | number | boolean): boolean {
    return !!value;
}
