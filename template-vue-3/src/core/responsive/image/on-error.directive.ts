import errorHandler from '@/core/responsive/image/image-helpers';
import { DirectiveBinding } from 'vue';
export const ImageNotFound = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const onErrorDirective = {
    beforeMount(el: HTMLElement, binding: DirectiveBinding): void {
        const classNamesArrayTemp = binding.value && binding.value[0] ? binding.value : [];
        const classNamesArray = ['c-on-error', ...classNamesArrayTemp];

        el.addEventListener('error', () => errorHandler(el, classNamesArray));
    },
};

export default onErrorDirective;
