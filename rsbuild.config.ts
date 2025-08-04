import path from 'node:path'
import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginMockServer } from 'rspack-plugin-mock/rsbuild'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress'
import { pluginHtmlMinifierTerser } from 'rsbuild-plugin-html-minifier-terser'

const { publicVars } = loadEnv({ prefixes: ['VITE_'] })

export default defineConfig({
  plugins: [
    // 表示将react和router相关的包拆分为单独的chunk
    pluginReact({
      splitChunks: {
        react: true,
        router: true,
      },
    }),
    pluginSass({
      // sass文件默认注入全局的变量文件
      sassLoaderOptions: {
        additionalData: `@use 'src/styles/variables.scss' as *;`,
      },
    }),
    // mock 插件
    pluginMockServer({
      // 表示拦截以路径/api开头的
      prefix: '/api',
    }),
    // 启动图片压缩
    pluginImageCompress(),
    // 启动html压缩
    pluginHtmlMinifierTerser(),
  ],
  // 配置html模板
  html: {
    favicon: path.resolve(__dirname, './src/assets/images/favicon.ico'),
    title: '销售协同管理系统',
    tags: [
      {
        tag: 'html',
        attrs: { lang: 'zh' },
      },
    ],
  },
  // 配置路径别名
  source: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    define: publicVars,
  },
  dev: {
    // 按需编译
    lazyCompilation: true,
  },
  // 构建产物相关配置
  output: {},
  // 构建优化相关
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      // 下面的部分单独分包
      forceSplitting: {
        axios: /node_modules[\\/]axios/,
        react: /node_modules[\\/]react/,
        antd: /node_modules[\\/]antd/,
        redux: /node_modules[\\/]redux/,
        lodash: /node_modules[\\/]lodash/,
        echarts: /node_modules[\\/]echarts/,
        antdIcons: /node_modules[\\/]@ant-design\/icons/,
      },
    },
    // 移除console.[method]语句
    removeConsole: true,
  },
  // 服务相关
  server: {
    host: '::',
    port: 3008,
    open: false,
    // historyApiFallback: {
    //   index: '/index.tsx',
    // },
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_API,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/api/, ''),
      },
      // '/api': {
      //   target: 'http://localhost:3008',
      //   changeOrigin: true,
      //   pathRewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
  },
})
