const autofocusDirective = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    mounted(el: HTMLElement, binding) {
        if (binding.value || binding.value === undefined) {
            el.focus();
        }
    },
};

export default autofocusDirective;
