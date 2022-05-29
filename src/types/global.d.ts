import '@vue/runtime-core'
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $refs: any,
        $dialog(com: any, propsData = {}): Promise<any>,
        api: API
    }
}

declare interface Window {

}