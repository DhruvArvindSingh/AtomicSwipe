module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'babel-plugin-dotenv-import',
                {
                    moduleName: '@env',
                    path: '.env',
                },
            ],
            'react-native-reanimated/plugin', // Must be last!
        ],
    };
};
