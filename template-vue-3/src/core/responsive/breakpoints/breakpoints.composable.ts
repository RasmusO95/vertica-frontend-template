import { map, find, throttle } from 'lodash-es';
import { useViewportEvents } from '../viewport/viewportEvents.composable';
import { Ref, ref, watch } from 'vue';

type BreakpointDef = { name: string; min: number; max: number };
type BreakpointsDef = BreakpointDef[];

const activeBreakpoint = ref('');
const { width } = useViewportEvents();

let watching = false;

const throttleUpdate = throttle(() => {
    activeBreakpoint.value = getActiveBreakpointFromWidth();

    function getActiveBreakpointFromWidth(): string {
        const activeBreakpoint = breakpoints.find(bp => {
            return bp.min <= width.value && bp.max >= width.value;
        });

        if (!activeBreakpoint) throw new Error('Could not find breakpoint');
        return activeBreakpoint.name;
    }
}, 500);

export {
    defineBreakpoints,
    isBreakpointActive,
    normalizeBreakpointsStructure,
    getBreakpointDef,
    useBreakpoints,
};

let breakpoints: BreakpointsDef = [];

function getBreakpoints(): BreakpointsDef {
    return breakpoints;
}

function getBreakpointDef(name: string): BreakpointDef {
    const bp = find(breakpoints, { name });
    if (!bp) {
        throw new Error(`${name} is not a known breakpoint`);
    }
    return bp;
}

/*
  Given breakpoints: 'xs', 'sm', 'md', 'lg', 'xl'
  Normalizes

    'xs,sm,lg' => 'xs,sm,lg'
    'min-md' => 'md,lg,xl'
    'min-sm,max-lg' => 'sm,md,lg'

    breakpoints can also be excluded with the 'not-' prefix: example: [max-xl, not-md] for all breakpoints besides md

 NB: Only expects to find at most 1 breakpoint with min- prefix and at most 1 with max- prefix, so only 1 range!
 */
function getNormalizedBreakpoints(breakpoints: string): string {
    const bpsAsArray = breakpoints.split(',').map(l => l.trim());
    let finalSizes: string[] = [...bpsAsArray].filter(bps => !bps.startsWith('min-') && !bps.startsWith('max-') && !bps.startsWith('not-'));
    const breakpointKeys = getBreakpoints().map(bp => bp.name);

    while (hasExcludedPrefixes(bpsAsArray)) {
        const excluded = bpsAsArray.find(s => s.startsWith('not'));
        if (!excluded) break;

        let excludedIdx = breakpointKeys.indexOf(stripPrefix(excluded));
        if (excludedIdx >= 0) { breakpointKeys.splice(excludedIdx, 1); }

        excludedIdx = bpsAsArray.indexOf(excluded);
        if (excludedIdx >= 0) { bpsAsArray.splice(excludedIdx, 1); }
    }

    if (hasMinMaxPrefixes(bpsAsArray)) {
        const minBp = bpsAsArray.find(s => s.startsWith('min-'));
        const minBpIx = minBp ? breakpointKeys.indexOf(stripPrefix(minBp)) : 0;
        const maxBp = bpsAsArray.find(s => s.startsWith('max-'));
        const maxBpIx = maxBp ? breakpointKeys.indexOf(stripPrefix(maxBp)) + 1 : breakpointKeys.length;
        const range = breakpointKeys.slice(minBpIx, maxBpIx);

        finalSizes = [...finalSizes, ...range];
    }

    return finalSizes.join(',');

    function hasMinMaxPrefixes(keys: string[]): boolean {
        return keys.some(k => k.startsWith('min-') || keys.some(k => k.startsWith('max-')));
    }

    function hasExcludedPrefixes(keys: string[]): boolean {
        return keys.some(k => k.startsWith('not-'));
    }

    function stripPrefix(size: string): string {
        return size.substr(size.indexOf('-') + 1);
    }
}

function normalizeBreakpointsStructure<T>(rawBreakpoints: { [rawBp: string]: T }): { [normalizedBp: string]: T } {
    return Object.keys(rawBreakpoints).reduce((result, rawBp) => {
        result[getNormalizedBreakpoints(rawBp)] = rawBreakpoints[rawBp];
        return result;
    }, {});
}

function defineBreakpoints(bps: { [bp: string]: { min: number; max: number } }): void {
    breakpoints = map(bps, (range, bp) => {
        return { name: bp, min: range.min, max: range.max };
    }).sort((a, b) => a.min - b.min);
}

function isBreakpointActive(normalizedBreakpoints: string): boolean {
    return normalizedBreakpoints.split(',').includes(activeBreakpoint.value);
}

function useBreakpoints(): Ref<string> {
    if (!watching) {
        watch(width, throttleUpdate, { immediate: true });
        watching = true;
    }
    return activeBreakpoint;
}
