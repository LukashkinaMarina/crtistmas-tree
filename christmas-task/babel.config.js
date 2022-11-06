module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    esmodules: true,
                },
            },
        ],
        '@babel/typescript',
    ],
    plugins: [
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true,
            },
        ],
        ['babel-plugin-styled-components', { displayName: true }],
        [
            'module-resolver',
            {
                root: ['./src'],
            },
        ],
    ],
};
