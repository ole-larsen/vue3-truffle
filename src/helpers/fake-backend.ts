/**
 * Monkey patching is a technique used to alter the behaviour of an existing function either to extend it or
 * change the way it works. In JavaScript this is done by storing a reference to the original function in a
 * variable and replacing the original function with a new custom function that (optionally) calls the original
 * function before/after executing some custom code.
 */

export { fakeBackend };

function fakeBackend() {
    let users = [{ id: 1, username: "test", password: "test", firstName: "Test", lastName: "User" }];
    let realFetch = window.fetch;
    window.fetch = function (url: any, opts: any): any {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith("/users/authenticate") && opts.method === "POST":
                        return authenticate();
                    case url.endsWith("/users") && opts.method === "GET":
                        return getUsers();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { username, password } = body();
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error("Username or password is incorrect");

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: "fake-jwt-token"
                });
            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok(users);
            }

            // helper functions

            function ok(body: any) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: "Unauthorized" })) })
            }

            function error(message: any) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
            }

            function isAuthenticated() {
                return opts.headers["Authorization"] === "Bearer fake-jwt-token";
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }
        });
    }
}