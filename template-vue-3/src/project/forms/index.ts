import { App } from 'vue';

import InputCheckbox from './InputCheckbox.vue';
import InputErrors from './InputErrors.vue';
import InputClear from './InputClear.vue';
import InputRadio from './InputRadio.vue';
import InputSelect from './InputSelect.vue';
import InputText from './InputText.vue';
import InputErrorMessage from './InputErrorMessage.vue';

export default function config(app: App<Element>): void {
    app.component(InputCheckbox.name, InputCheckbox);
    app.component(InputErrors.name, InputErrors);
    app.component(InputClear.name, InputClear);
    app.component(InputRadio.name, InputRadio);
    app.component(InputSelect.name, InputSelect);
    app.component(InputText.name, InputText);
    app.component(InputErrorMessage.name, InputErrorMessage);
}
