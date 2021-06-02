/*
|-----------------------------------------------------------------------------
| Screens                      https://tailwindcss.com/docs/responsive-design
|-----------------------------------------------------------------------------
|
| Screens in Tailwind are translated to CSS media queries. They define the
| responsive breakpoints for your project. By default Tailwind takes a
| "mobile first" approach, where each screen size represents a minimum
| viewport width. Feel free to have as few or as many screens as you
| want, naming them in whatever way you'd prefer for your project.
|
| Tailwind also allows for more complex screen definitions, which can be
| useful in certain situations. Be sure to see the full responsive
| documentation for a complete list of options.
|
| Class name: .{screen}:{utility}
|
*/

/* REMEMBER TO KEEP IN SYNC WITH breakpointConfig.ts */

const screens = {
    print: { raw: 'print' },
    xs: '0px', // mobile and up
    'only-xs': { min: 0, max: '414px' }, // Pure mobile
    sm: '415px', // Mobile and tablet vertical and up
    md: '769px', // Up to and including old tablet horizontal and up
    'only-md': { min: 0, max: '768px' }, // Mobile up until tablet
    lg: '1025px', // Desktop and up
    xl: '1280px', // Large desktop
};

/* REMEMBER TO KEEP IN SYNC WITH breakpointConfig.ts */

module.exports = screens;
