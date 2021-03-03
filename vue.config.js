module.exports = {
    configureWebpack: {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    node_vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: 1,
                    },
                },
                name: 'vendor',
            },
        },
    },
}
