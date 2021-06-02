import { configureBreakpoints } from '@/core/responsive/breakpoints/breakpointsConfig';

export const XS = 'xs';
export const SM = 'sm';
export const MD = 'md';
export const LG = 'lg';
export const XL = 'xl';

/* REMEMBER TO KEEP IN SYNC WITH TAILWINDS screens */
const breakpoints = {
    [XS]: 0, // Pure mobile
    [SM]: 415, // Mobile and tablet vertical
    [MD]: 769, // Up to and including old tablet horizontal
    [LG]: 1025, // Desktop,
};

configureBreakpoints(breakpoints);
