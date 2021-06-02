import errorHandler from '@/core/responsive/image/image-helpers';
import { DirectiveBinding } from 'vue';

const delegateOnImgErrorDirective = {
    beforeMount(elWrapper: HTMLElement, binding: DirectiveBinding): void {
        const imageEls = elWrapper.querySelectorAll('img');

        const classNamesArrayTemp = binding.value && binding.value[0] ? binding.value : [];
        const classNamesArray = ['c-on-error', ...classNamesArrayTemp];

        imageEls.forEach((el, index) => {
            el.addEventListener('error', () => errorHandler(el, classNamesArray));
        });
    },
};

export default delegateOnImgErrorDirective;
