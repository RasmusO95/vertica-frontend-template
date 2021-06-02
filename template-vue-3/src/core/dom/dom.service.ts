class DomService {
    private static VIEWPORT = 'viewport';

    public setPageTitle(title: string): void {
        document.title = title;
    }

    public getMetaViewport() {
        return this.getMetaElement(DomService.VIEWPORT).content;
    }

    public setMetaViewport(content: string) {
        return this.setContent(DomService.VIEWPORT, null, content);
    }

    private getHeadElement(): HTMLHeadElement | null {
        return document.head;
    }

    private setContent(nameAttribute: string | null = null, propertyAttribute: string | null = null, content: string): HTMLMetaElement {
        const tag = this.getMetaElement(nameAttribute, propertyAttribute);
        tag.content = this.sanitizeInput(content);
        return tag;
    }

    private sanitizeInput(input: string): string {
        return input || '';
    }

    private getMetaElement(nameAttribute: string | null = null, propertyAttribute: string | null = null): HTMLMetaElement {
        return this.getOrCreate<HTMLMetaElement>('meta[' + (nameAttribute ? 'name="' + nameAttribute + '"' : '') + (propertyAttribute ? 'property="' + propertyAttribute + '"' : '') + ']', () => {
            const element = document.createElement('meta');
            if (nameAttribute) {
                element.name = nameAttribute;
            }
            if (propertyAttribute) {
                element.setAttribute('property', propertyAttribute);
            }
            const headElement = this.getHeadElement();
            if (headElement) {
                headElement.appendChild(element);
            }
            return element;
        });
    }

    private getOrCreate<TElement extends HTMLElement>(selector: string, create?: () => TElement): TElement {
        const element = document.querySelector(selector) as TElement;
        if (element) {
            return element;
        }
        if (create) {
            return create();
        }
        throw new Error(`Provide create param when element ${selector} cannot be found.`);
    }
}

export default new DomService();
