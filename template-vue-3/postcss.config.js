/* eslint-disable @typescript-eslint/no-var-requires */
const postcssImport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const postcssNesting = require('postcss-nesting');
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        postcssImport,
        tailwindcss({
            config: './src/styling/tailwind.config.js',
        }),
        postcssNesting,
        autoprefixer,
    ],
};
