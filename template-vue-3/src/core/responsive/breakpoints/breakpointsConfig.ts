import { defineBreakpoints } from './breakpoints.composable';
import { map } from 'lodash';

export type BreakpointsConfiguration = { [bp: string]: number };

/*
  Converts something like this:
    screens: {
        sm: '0',
        md: '640',
        lg: '960',
        xl: '1025',
    },

   To something like this:
   {
       sm: { min: 0, max: 639 },
       md: { min: 640, max: 959 },
       lg: { min: 960, max: 1024 },
       xl: { min: 1025, max: 999999 },
   }
*/

export function configureBreakpoints(breakpoints: BreakpointsConfiguration): void {
    const orderedNormalizedBreakpoints = map(breakpoints, (min, bp) => {
        return { name: bp, min: min };
    }).sort((a, b) => a.min - b.min);

    const breakpointArrayWithMax = map(orderedNormalizedBreakpoints, (bp, ix) => {
        let max;
        if (ix < orderedNormalizedBreakpoints.length - 1) {
            max = orderedNormalizedBreakpoints[ix + 1].min - 1;
        } else {
            max = 999999;
        }
        return { ...bp, ...{ max } };
    });

    const finalBreakpoints = breakpointArrayWithMax.reduce((acc, bp) => {
        acc[bp.name] = { min: bp.min, max: bp.max };
        return acc;
    }, {});

    defineBreakpoints(finalBreakpoints);
}
