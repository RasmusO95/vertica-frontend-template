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

export interface FocalPoint {
    x: number;
    y: number;
}

export interface ImageMedia {
    url: string;
    focalPoint: FocalPoint;
}

export enum CallToActionVariant {
    darkButton,
    lightButton,
    lightButtonOutlined,
    darkButtonOutlined,
    lightArrowLink,
    darkArrowLink
}

export interface CallToActionButton {
    text: string;
    variant: CallToActionVariant;
}

export interface CallToActionLink {
    text: string;
    variant: CallToActionVariant;
    url: string;
    target: string;
}

export interface VideoMedia {
    vimeoId?: number;
    youtubeId?: string;
}

export interface HeroBlockViewModel extends BaseBlockViewModel {
    image?: ImageMedia;
    video?: VideoMedia;
    link: CallToActionLink;
    productId?: string;
    label: string;
    title: string;
    bodyText?: string;
}

export interface A3BlockViewModel extends BaseBlockViewModel {
    image?: ImageMedia;
    video?: VideoMedia;
    link: CallToActionLink;
    productId?: string;
    label?: string;
    title: string;
    bodyText: string;
    backgroundColor?: string;
    textColor?: 'white' | 'black';
}

export interface A4BlockViewModel extends BaseBlockViewModel {
    image?: ImageMedia;
    video?: VideoMedia;
    link: CallToActionLink;
    productId?: string;
    label?: string;
    title: string;
    bodyText: string;
    backgroundColor?: string;
    textColor?: 'white' | 'black';
}

export interface A8BlockViewModel extends BaseBlockViewModel {
    image?: ImageMedia;
    link?: CallToActionLink;
    label?: string;
    title: string;
    bodyText: string;
    backgroundColor?: string;
    textColor?: 'white' | 'black';
    layout: 'image-left' | 'image-right';
}
