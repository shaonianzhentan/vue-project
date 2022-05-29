declare interface API {
    service: Service,
    validate: Validate,
    localStorage: ApiLocalStorage,
    sessionStorage: ApiSessionStorage
}

interface ApiLocalStorage extends WindowLocalStorage {
    test: number
}

interface ApiSessionStorage extends WindowSessionStorage {
    test: number
}

interface Validate {
}