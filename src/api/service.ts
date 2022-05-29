import http from './http'

const service = new Proxy({}, {
    get(target: any, property: string) {
        return async (data: object, query: object, params: object) => {
            const url = property.replace(/_/g, '/')
            console.log(url)
            return await http.post(url, data, query, params);
        }
    }
})

export default service as Service