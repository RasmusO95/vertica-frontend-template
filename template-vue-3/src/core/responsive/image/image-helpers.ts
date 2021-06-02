import $ from 'cash-dom';
import { ImageNotFound } from './on-error.directive';

function errorHandler(el: HTMLElement, classNamesArray: string[] = []): void {
    el.setAttribute('src', ImageNotFound);
    el.removeAttribute('srcset');

    $(el.parentNode).children('source').remove();

    classNamesArray.forEach((className: string) => {
        el.classList.add(className);
    });
}

export default errorHandler;
