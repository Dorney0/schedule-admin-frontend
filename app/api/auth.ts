import axios from 'axios'

const authapi = axios.create({
    baseURL: 'http://localhost:5252/api',
    withCredentials: true
})

async function registerUser(login: string, password: string, fullName: string) {
    return authapi.post('/auth/register', {
        login,
        password,
        fullName,
        role: 'teacher'
    })
}

async function loginUser(login: string, password: string) {
    return authapi.post('/auth/login', { login, password })
}

async function getMe(accessToken: string) {
    return authapi.get('/auth/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

async function logoutUser() {
    return authapi.post('/auth/logout')
}

export default authapi
export { registerUser, loginUser, getMe, logoutUser }

