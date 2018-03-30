module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    extends: 'standard',
    globals: {
        __static: true
    },
    plugins: [
        'html'
    ],
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // 忽略缩紧
        'indent': 0,
        // 函数定义时括号前面要不要有空格
        "space-before-function-paren" : 0,
        // 执行回调错误处理
        "handle-callback-err": 0
    }
}
