const storage = new Proxy({
    prefix: 'LS_'
}, {
    get(target: any, property: string) {
        try {
            const result = JSON.parse(window.localStorage[target.prefix + property])
            return result.value
        } catch (ex) {
            console.error(ex)
        }
        return null
    },
    set(target: any, property: string, value) {
        window.localStorage[target.prefix + property] = JSON.stringify({
            value,
            time: Date.now()
        })
        return true
    }
})

export default storage as ApiLocalStorage