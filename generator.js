module.exports = (api, options, rootOptions) => {
    // 安装一些基础公共库
    api.extendPackage({
        scripts: {
            test: 'vue-cli-service test'
        },
        dependencies: {
            "axios": "^0.19.0"
        },
        devDependencies: {
            "cross-env": "^5.2.0",
            "jenkins": "^0.26.0",
        }
    });

    // 安装 vuex
    if (options.vuex) {
        api.extendPackage({
            dependencies: {
                vuex: '^3.0.1'
            }
        });

        api.render('./template/vuex');
    }

    // 安装 element-ui 库
    if (options.elementUI) {
        api.extendPackage({
            devDependencies: {
                "element-ui": "^2.13"
            }
        });
    }

    // 公共基础目录和文件
    api.render('./template/default');

    // 配置文件
    // api.render({
    //   './.eslintrc.js'     : './template/_eslintrc.js',
    //   './.gitignore'       : './template/_gitignore',
    //   './.postcssrc.js'    : './template/_postcssrc.js'
    // });
}