import service from "./service"
import localStorage from "./localStorage"
import sessionStorage from "./sessionStorage"
import validate from './validate'

class API {

    get service() {
        return service
    }

    get localStorage() {
        return localStorage
    }

    get sessionStorage() {
        return sessionStorage
    }

    get validate() {
        return validate
    }

}

const api = new API()

export default api