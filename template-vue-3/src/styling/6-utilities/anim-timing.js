/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * All 'js-styles' (tailwind plugins) are required and included in ../plugins.js
 *
 *
 * Generated class samples
 *
 * .u-anim-dur-100{
 *     animation-duration:100ms;
 * }
 *
 * .u-anim-delay-100{
 *     animation-delay:100ms;
 * }
 *
 *
 */

import _map from 'lodash/map';
import _range from 'lodash/range';

export default function(variants) {
    return function({ e, addUtilities }) {
        const range = _range(100, 1100, 50);

        const utilities = [
            ..._map(range, duration => ({
                [`.${e(`u-anim-dur-${duration}`)}`]: {
                    animationDuration: `${duration}ms`,
                },
            })),
            ..._map(range, delay => ({
                [`.${e(`u-anim-delay-${delay}`)}`]: {
                    animationDelay: `${delay}ms`,
                },
            })),
        ];

        addUtilities(utilities, variants);
    };
}
