<template>
    <component :is="maybeLazyInit"
               class="responsive-image"
               :class="{ 'responsive-image--loaded': loadEventFired, 'responsive-image--scrim': scrim }"
               :style="style"
               :offset="offset">
        <picture ref="picture">
            <source v-if="isWebpWithFallback" key="webpFallbackSrc" type="image/webp"
                    :srcset="srcset" :sizes="sizesFromWidthOnScreen">
            <source :srcset="fallbackSrcset" :sizes="sizesFromWidthOnScreen">
            <img ref="image" v-on-error
                 :alt="alt"
                 :src="src"
                 @load="handleLoad">
        </picture>
        <div v-if="debugEnabled" class="debug-enabled">
            {{ currentSrc }}
        </div>
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from 'vue';
import { sortBy, keys, zipObject, map } from 'lodash';
import { getBreakpointDef, isBreakpointActive, normalizeBreakpointsStructure } from '../breakpoints/breakpoints.composable';
import logging from '@/core/infrastructure/logging';
import responsiveImageService from './responsive-image.service';

export interface IResponsiveImageWidthOnScreenConfig {
    [key: string]: number;
}
export interface IFocalPoint {
    left: number;
    top: number;
}

export default defineComponent({
    name: 'ResponsiveImage',
    props: {
        imageUrl: {
            type: String,
            default: '',
        },
        widthOnScreen: {
            type: [Object, Number],
            default: 100,
        },
        lazy: {
            type: Boolean,
            default: true,
            required: false,
        },
        zoom: {
            type: Boolean,
            default: false,
            required: false,
        },
        scrim: {
            type: Boolean,
            default: false,
            required: false,
        },
        offset: {
            type: Number,
            default: 200,
            required: false,
        },
        bgColor: {
            type: String,
            default: 'transparent',
        },
        quality: {
            type: Number,
            default: 81,
            validator: (value: number) => { return value >= 1 && value <= 100; },
        },
        alt: {
            type: String,
            default: '',
        },
        focus: {
            type: [Boolean, String],
            default: '',
        },
        mode: {
            type: String,
            default: 'crop',
            validator: (value: string) => { return ['crop', 'pad'].indexOf(value) !== -1; },
        },
        format: {
            type: String,
            default: 'jpg',
            validator: (value: string) => { return ['jpg', 'png', 'webp'].indexOf(value) !== -1; },
        },
        cacheBust: {
            type: [String, Number],
            required: false,
            default: '1',
        },
        /* Can take a single aspect ratio number, or an object with a number pr. breakpoint. If a 'default' is provided is will be used when no breakpoint is active:
            {
                 xs: 16/9,
                 min-sm,max-md: 4/3
                 default: 1/2
            }
         */
        aspectRatio: {
            type: [Number, Object],
            default: 16 / 9,
        },
    },
    setup(props) {
        const sizes: Array<number> = responsiveImageService.getSizes();
        const hasSrcsetSupport: Ref<boolean> = ref(true);
        const loadEventFired: Ref<boolean> = ref(false);
        const image: Ref<HTMLElement | null> = ref(null);
        const debugEnabled = false;

        const activeAspectRatio = computed(() => {
            if (typeof props.aspectRatio === 'number') {
                return props.aspectRatio;
            }

            // Else - object with aspect-ratio pr. breakpoint-def. Normalize once.
            const aspectRatiosByNormalizedBreakpoints = normalizeBreakpointsStructure(props.aspectRatio);

            // Find first active breakpoint-def
            const activeBpDef = Object.keys(aspectRatiosByNormalizedBreakpoints).find((bpDef) => isBreakpointActive(bpDef));
            // Use active or default
            const result = activeBpDef ? aspectRatiosByNormalizedBreakpoints[activeBpDef] : (aspectRatiosByNormalizedBreakpoints as any).default;
            if (!result) {
                throw new Error('Provide a breakpoint-definition for all cases or a default');
            }
            return result;
        });

        const absoluteImageUrl = computed(() => {
            return responsiveImageService.getBaseUrl() + props.imageUrl;
        });

        const isWebpSrc = computed(() => {
            return props.imageUrl.indexOf('.webp') > -1;
        });

        const isPngSrc = computed(() => {
            return props.imageUrl.indexOf('.png') > -1;
        });

        const isWebpWithFallback = computed(() => {
            return isWebpSrc.value || props.format === 'webp';
        });

        const isAlphaChannelSrc = computed(() => {
            return isWebpSrc.value || isPngSrc.value;
        });

        const normalizedBgColor = computed(() => {
            return props.bgColor.replace('#', '');
        });

        const maybeLazyInit = computed(() => {
            return props.lazy ? 'lazy-init' : 'div';
        });

        const style = computed(() => {
            const padding = `${(100 / activeAspectRatio.value).toFixed(2)}%`;
            const style = { paddingTop: padding, background: `#${normalizedBgColor.value}` };

            return style;
        });

        const heightFromWidth = (width) => {
            return Math.round(width / activeAspectRatio.value);
        };

        const formatImageUrl = (width: number, height: number, format?: string): string => {
            // eslint-disable-next-line no-unused-expressions
            isAlphaChannelSrc; // Just in order not to remove that func while showing kittens
            return `${absoluteImageUrl.value}/${width}/${height}?format=${format || props.format}&width=${width}&height=${height}}`;
        };

        /*
        const formatImageUrl = (width: number, height: number, format?: string): string => {
            const firstSeparator = !props.imageUrl || props.imageUrl.indexOf('?') === -1 ? '?' : '&';
            const focus = props.focus ? `&c.focus=${props.focus}` : '';
            const additionalCropModeParam = props.mode === 'crop' ? '&c.finalmode=crop' : '';
            const bgColor = normalizedBgColor.value === 'transparent' || isAlphaChannelSrc.value ? '' : `&bgcolor=${normalizedBgColor.value}`;
            return `${absoluteImageUrl.value}${firstSeparator}format=${format || props.format}&width=${width}&height=${height}&scale=both&quality=${props.quality}&c.zoom=${props.zoom}&mode=${props.mode}${additionalCropModeParam}${focus}${bgColor}&cachebusting=${props.cacheBust}`;
        }; */

        const sortConfigBySize = (config: IResponsiveImageWidthOnScreenConfig) => {
            const sortedKeys = sortBy(keys(config), (key) => {
                return config[key];
            });

            return zipObject(
                sortedKeys,
                map(sortedKeys, function(key) {
                    return config[key];
                }),
            );
        };

        const sizesFromWidthOnScreen = computed(() => {
            const sortedConfigSizes = typeof props.widthOnScreen === 'object'
                ? sortConfigBySize(props.widthOnScreen)
                : [props.widthOnScreen];

            // Prepend a max image size in px. when we have maxWidth defined.
            const maxWidth = responsiveImageService.getMaxWidth();
            const maxImageWidth = maxWidth && maxWidth * sortedConfigSizes[0] / 100;
            let sizes: string[] = maxImageWidth ? [`(min-width: ${responsiveImageService.getMaxWidth()}px) ${maxImageWidth}px`] : [];

            if (typeof props.widthOnScreen === 'object') {
                sizes = sizes.concat(map(sortedConfigSizes, (width, screen) => {
                    if (!getBreakpointDef(screen)) {
                        const errorMessage = `ResponsiveImage: Breakpoint ${screen} is not defined for imageUrl ${
                            absoluteImageUrl.value
                        }`;
                        logging.warn(errorMessage);
                    }
                    return `(min-width: ${getBreakpointDef(screen).min}px) ${width}vw`;
                }));
                sizes.push('100vw');
            } else {
                sizes = sizes.concat([`${props.widthOnScreen}vw`]);
            }

            return sizes.join(',');
        });

        const srcset = computed(() => {
            let srcset = '';
            if (hasSrcsetSupport.value) {
                srcset = sizes
                    .map((width) => {
                        return formatImageUrl(width, heightFromWidth(width)) + ` ${width}w`;
                    })
                    .join(', ');
            }
            return srcset;
        });

        const fallbackSrcset = computed(() => {
            return srcset.value.split('&format=webp').join('&format=jpg');
        });

        const fallbackSrc = computed(() => {
            const width = sizes[sizes.length - 2]; // second largest
            const format = isWebpWithFallback.value ? 'jpg' : props.format;
            return formatImageUrl(width, heightFromWidth(width), format);
        });

        const src = computed(() => {
            return hasSrcsetSupport.value ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : fallbackSrc.value;
        });

        const handleLoad = (): void => {
            loadEventFired.value = true;
        };

        onMounted(() => {
            hasSrcsetSupport.value = image.value ? 'sizes' in image.value : true;
        });

        const currentSrc = ref('');
        const picture = ref(null);
        if (debugEnabled) {
            setInterval(() => {
                if (picture.value) {
                    currentSrc.value = (picture.value as any as HTMLPictureElement).querySelector('img')?.currentSrc ?? '';
                }
            }, 500);
        }

        return {
            sizes,
            hasSrcsetSupport,
            loadEventFired,
            src,
            style,
            maybeLazyInit,
            sizesFromWidthOnScreen,
            image,
            isWebpWithFallback,
            fallbackSrcset,
            srcset,
            handleLoad,
            debugEnabled,
            currentSrc,
            picture,
        };
    },
});
</script>

<style scoped>

.responsive-image {
    position: relative;
    overflow: hidden;
    height: 0;
    display: block;
}

.responsive-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity .3s cubic-bezier(.215,.61,.355,1);
}

.responsive-image--loaded img {
    opacity: 1;
}

.responsive-image--scrim:after {
    content: '';
    @apply absolute inset-0 bg-black opacity-20;
}

.debug-enabled {
    @apply absolute inset-0;
    background-color: #ffffff80;
    font-size: 18px;
    word-break: break-all;
}

</style>
