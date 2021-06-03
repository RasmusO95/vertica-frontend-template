// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasePageViewModel {}

export interface PageData {
    pageType: string;
    content: BasePageViewModel;
    // metadata
    // breadcrumb
    // etc.
}

export interface BaseBlockViewModel {
    blockType: string;
}

export interface ContentPageViewModel extends BasePageViewModel {
    blocks: BaseBlockViewModel[]
}
