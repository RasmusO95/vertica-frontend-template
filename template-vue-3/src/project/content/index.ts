import { blockResolver, pageResolver } from '@/core/content/componentResolver';
import ContentPage from '@/pages/ContentPage.vue';
import FallbackBlock from '@/core/content/FallbackBlock.vue';
import { App } from 'vue';

export default function config(app: App<Element>): void {
    registerPages();
    registerBlocks();
}

function registerPages(): void {
    pageResolver.register('content', ContentPage);
}

function registerBlocks(): void {
    blockResolver.registerFallback(FallbackBlock);
}
