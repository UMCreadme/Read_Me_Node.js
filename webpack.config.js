import nodeExternals from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: "production", // 배포 모드로 설정
    entry: './index.js', // 서버 코드의 진입점
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.cjs", // CommonJS 형식으로 출력
        libraryTarget: "commonjs2" // CommonJS 형식으로 출력
    },
    module: {
        rules: [
            {
                test: /\.m?js$/, // .mjs와 .js 파일을 처리
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    target: "node",
    externalsPresets: { node: true },
    externals: [nodeExternals()],
};
