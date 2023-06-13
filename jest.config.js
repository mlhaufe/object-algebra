export default {
    moduleFileExtensions: [
        'js',
        'mjs',
        'mts'
    ],
    moduleNameMapper: {
        '^(\\.\\.?/.*)\\.mjs$': [
            '$1.mts',
            '$0'
        ]
    },
    reporters: [
        'default',
        ['jest-junit', { outputDirectory: './coverage' }]
    ],
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/**/*.m[jt]s?(x)',
        '**/?(*.)+(spec|test).m[tj]s?(x)'
    ],
    transform: {
        '^.+\\.mts$': ['ts-jest', { useESM: true }]
    }
};