import path from 'path';
import url from 'url';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = url.fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

export default {
    devtool: 'source-map',
    entry: './src/index.mts',
    experiments: {
        outputModule: true
    },
    mode: 'production',
    module: {
        rules: [
            { test: /\.m?ts$/, use: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['.mts', '.mjs', '.js', '.ts', '.json'],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    output: {
        clean: true,
        library: { type: 'module' },
        module: true,
        filename: 'index.mjs',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'package.json',
                    to: 'package.json',
                    transform: (content) => {
                        const obj = JSON.parse(content);
                        delete obj.devDependencies;
                        delete obj.scripts;
                        delete obj.files
                        obj.module = 'index.mjs';

                        return JSON.stringify(obj, null, 4);
                    }
                },
                {
                    from: 'README.md',
                    to: 'README.md'
                },
                {
                    from: 'LICENSE',
                    to: 'LICENSE',
                    toType: 'file'
                },
                {
                    from: 'CHANGELOG.md',
                    to: 'CHANGELOG.md'
                }
            ]
        })
    ]
};