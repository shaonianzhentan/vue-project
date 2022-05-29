const storage = new Proxy({
    prefix: 'SS_'
}, {
    get(target: any, property: string) {
        try {
            const result = JSON.parse(window.sessionStorage[target.prefix + property])
            return result.value
        } catch (ex) {
            console.error(ex)
        }
        return null
    },
    set(target: any, property: string, value) {
        window.sessionStorage[target.prefix + property] = JSON.stringify({
            value,
            time: Date.now()
        })
        return true
    }
})

export default storage as ApiSessionStorage