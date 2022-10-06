import {getCurrentInstance} from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        provider:   getCurrentInstance()?.appContext.config.globalProperties.$rpc,
        user: JSON.parse(localStorage.getItem('user') as string),
    }),
    getters: {
        getUser:  (state) => state.user,
    },
    actions: {
        getBodyString(credentials: { [property: string]: string }): string {
            const formData = new FormData();
            if (credentials.username) {
                formData.append('username', credentials.username);
            }
            if (credentials.password) {
                formData.append('password', credentials.password);
            }

            // data to be sent to the POST request
            let body = ""
            for (let prop in credentials) {
                if (credentials.hasOwnProperty(prop)) {
                    body += prop + "=" + (credentials as {
                        [property: string]: string
                    })[prop] + "&"
                }
            }
            return body.slice(0, -1)
        },
        signup(credentials: {
            username: string;
            email: string;
            password: string;
            repeat: string;
        }) {
            if (!credentials.email || !credentials.password) {
                throw new Error("invalid credentials")
            }
            if (credentials.password !== credentials.repeat) {
                throw new Error("password not match")
            }
            return fetch(`http://localhost:1111/api/v1/auth/signup`, {
                method: 'POST', // or 'PUT'
                body: this.getBodyString(credentials),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            .then(response => {
                return response.status !== 200 ? response.json() : response.text()
            })
            .then(response => {
                return response
            })
            .catch(e => {
                console.log(e)
                throw e
            })

        },
        login(credentials: {username: string, password: string } ) {
            if (!credentials.username || !credentials.password) {
                throw new Error("invalid credentials")
            }
            return fetch(`http://localhost:1111/api/v1/auth/login`, {
                method: 'POST', // or 'PUT'
                body: this.getBodyString(credentials),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            .then(response => response.json())
            .then(response => {
                if (response.code && response.message) {
                    localStorage.removeItem('user')
                    return response
                }
                if (response.id) {
                    localStorage.setItem('user', JSON.stringify(response))
                }
                return response
            })
            .catch(e => {
                console.log(e)
                throw e
            })
        },
        restore(credentials: { username: string } ) {
            if (!credentials.username) {
                throw new Error("invalid credentials")
            }
            return fetch(`http://localhost:1111/api/v1/auth/forgot-password`, {
                method: 'POST', // or 'PUT'
                body: this.getBodyString(credentials),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if (response.code && response.message) {
                    return response
                }
                return response
            })
            .catch(e => {
                console.log(e)
                throw e
            })

            // console.log(credentials)
            // const user = await fetchWrapper.post(`${baseUrl}/login`, {
            //     username: credentials.username,
            //     password: credentials.password
            // });
            //
            // // update pinia state
            // this.user = user

            // store user details and jwt in local storage to keep user logged in between page refreshes
            // localStorage.setItem('user', JSON.stringify(user));

            // redirect to previous url or default to home page
            // router.push(this.returnUrl || '/');
        },
        check2fa(user2fa: {
            code: string;
            otp:  string;
        }) {
            const user = JSON.parse(localStorage.getItem('user') as string)
            if (!user || !user.username) {
                throw new Error("invalid credentials")
            }
            return fetch(`http://localhost:1111/api/v1/auth/2fa`, {
                method: 'POST', // or 'PUT'
                body: this.getBodyString({ id: user.id, username: user.username, otp: user2fa.otp, code: user2fa.code, token: user.token }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
                .then(response => response.json())
                .then(response => {
                    if (response.code && response.message) {
                        return response
                    }
                    if (response.id) {
                        // add token to user
                        localStorage.setItem('user', JSON.stringify(response));
                    }
                    return response
                })
                .catch(e => {
                    throw e
                })
        },
        get2fa() {
            const user = JSON.parse(localStorage.getItem('user') as string)
            if (!user || !user.username) {
                throw new Error("invalid credentials")
            }

            return fetch(`http://localhost:1111/api/v1/auth/2fa`, {
                method: 'POST', // or 'PUT'
                body: this.getBodyString(user),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
                .then(response => {
                    return response.json()
                })
                .then(response => {
                    if (response.code && response.message) {
                        return response
                    }
                    console.log(response)
                    return response
                })
                .catch(e => {
                    console.log(e)
                    throw e
                })
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            //router.push('/login');
        }
    }
})
// import { defineStore } from 'pinia';
//
// import { fetchWrapper } from '@/helpers';
// import router from "@/router"
// import {getCurrentInstance} from "vue";
// const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/oauth`;
//
// export const useAuthStore = defineStore({
//     id: 'oauth',
//     state: () => ({
//         provider:   getCurrentInstance()?.appContext.config.globalProperties.$rpc,
//         // initialize state from local storage to enable user to stay logged in
//         user: JSON.parse(localStorage.getItem('user') as string),
//         returnUrl: null
//     }),
//     actions: {
//         async login(credentials: {username: string, password: string } ) {
//             try {
//                 if (!credentials.username || !credentials.password) {
//                     throw new Error("invalid credentials")
//                 }
//
//                 console.log(getCurrentInstance(), this.provider)
//                 const response = await this.provider("http://localhost:1111/api/v1/auth/login", {
//                     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//                     mode: 'cors', // no-cors, *cors, same-origin
//                     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//                     credentials: 'same-origin', // include, *same-origin, omit
//                     headers: {
//                         'Content-Type': 'application/json'
//                         // 'Content-Type': 'application/x-www-form-urlencoded',
//                     },
//                     redirect: 'follow', // manual, *follow, error
//                     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//                     body: JSON.stringify(credentials) // body data type must match "Content-Type" header
//                 });
//                 console.log (await response.json()); // parses JSON response into native JavaScript objects
//
//
//                 // console.log(credentials)
//                 // const user = await fetchWrapper.post(`${baseUrl}/login`, {
//                 //     username: credentials.username,
//                 //     password: credentials.password
//                 // });
//                 //
//                 // // update pinia state
//                 // this.user = user
//
//                 // store user details and jwt in local storage to keep user logged in between page refreshes
//                 // localStorage.setItem('user', JSON.stringify(user));
//
//                 // redirect to previous url or default to home page
//                 // router.push(this.returnUrl || '/');
//             } catch(e) {
//                 throw e
//             }
//
//         },
//         logout() {
//             this.user = null;
//             localStorage.removeItem('user');
//             router.push('/login');
//         }
//     }
// });
