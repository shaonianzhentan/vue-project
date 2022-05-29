import home from './home'

import LayoutIndex from '@/components/layout/index.vue'

// 视图meta配置
const routesConfig: any = {
    home
}

// 布局配置
const routes = [
    {
        path: '/',
        redirect: '/home/index'
    },
    {
        path: '/layout/index',
        name: 'layout-index',
        component: LayoutIndex,
        children: []
    }
]

const modules = import.meta.glob("../../views/**/**.vue")
console.log(modules)
Object.keys(modules).forEach((key: string) => {
    // 配置目录和文件
    const result = key.match("\.\.\/\.\.\/views/(.+)/(.+)\.vue") as any
    const folder = result[1]
    const fileName = result[2]
    // 读取自定义配置
    let layoutName = 'index'
    let meta: any = {}
    const config = routesConfig[folder]
    if (config && config[fileName]) {
        meta = config[fileName]
        if ('layout' in meta) {
            layoutName = meta.layout
            delete meta.layout
        }
    }
    // 查找布局视图
    const layoutComponent = routes.find(ele => ele.name === `layout-${layoutName}`) as any
    if (!layoutComponent) {
        throw new Error(`没有找到Layouut视图：layout-${layoutName}`)
    }
    // 添加组件
    layoutComponent.children.push({
        path: `/${folder}/${fileName}`,
        name: `${folder}-${fileName}`,
        component: modules[key],
        meta
    })
})
console.log(routes)
export default routes