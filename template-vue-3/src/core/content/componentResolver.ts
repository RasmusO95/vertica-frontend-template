import { unref } from 'vue';

type ComponentType = any | (() => any);

class ComponentResolver {
    components = new Map<string, ComponentType>();
    fallback: ComponentType | undefined;

    register<T extends string>(blockType: T, component: ComponentType) {
        if (this.components.get(blockType)) {
            throw new Error(`${blockType} already registered`);
        }
        this.components.set(blockType, component);
    }

    registerFallback(component: ComponentType) {
        this.fallback = component;
    }

    resolve(blockType: string): ComponentType | null {
        const component = this.components.get(unref(blockType));
        if (!component) {
            if (this.fallback) {
                return this.fallback;
            } else {
                const msg = `${blockType} not registered and no default component`;
                throw new Error(msg);
            }
        }
        return component;
    }
}

export const blockResolver = new ComponentResolver();
export const pageResolver = new ComponentResolver();
