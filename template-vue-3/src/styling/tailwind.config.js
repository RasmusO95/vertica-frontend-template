module.exports = {
    purge: { content: ['./src/**/*.vue'] },
    darkMode: false, // or 'media' or 'class'
    theme: {
        backgroundColor: theme => theme('colors'),
        borderColor: theme => theme('colors'),

        fontSize: {
            10: '1.0rem',
            11: '1.1rem',
            12: '1.2rem',
            13: '1.3rem',
            14: '1.4rem',
            15: '1.5rem',
            16: '1.6rem',
            18: '1.8rem',
            20: '2.0rem',
            22: '2.2rem',
            24: '2.4rem',
            34: '3.4rem',
            36: '3.6rem',
            46: '4.6rem',
        },

        opacity: {
            0: '0',
            20: '0.20',
            25: '0.25',
            30: '0.3',
            50: '0.5',
            75: '0.75',
            80: '0.80',
            100: '1',
        },
    },
    variants: {
        margin: ['responsive', 'first', 'last'],
        padding: ['responsive', 'first', 'last'],
    },
    plugins: [],
};
