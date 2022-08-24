const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const svgToMiniDataURI = require("mini-svg-data-uri")
const RemovePlugin = require("remove-files-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

webpack(
    {
        mode: "production",
        entry: "./src/check.less",
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "trash.js",
            clean: true,
        },
        target: `web`,
        module: {
            rules: [
                {
                    test: /\.less$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "less-loader",
                    ],
                },
                {
                    test: /\.svg$/i,
                    type: "asset/inline",
                    generator: {
                        dataUrl: (content) => {
                            return svgToMiniDataURI(content.toString())
                        },
                    },
                },
            ],
        },
        optimization: {
            minimizer: [new CssMinimizerPlugin()],
        },
        plugins: [
            new MiniCssExtractPlugin({ filename: "check.min.css" }),
            new RemovePlugin({
                after: {
                    root: "./build",
                    include: ["trash.js"],
                },
            }),
        ],
    },
    (err, stats) => {
        if (err) {
            console.error(err)
            return
        }

        console.log(
            stats.toString({
                chunks: false,
                colors: true,
            })
        )
    }
)
