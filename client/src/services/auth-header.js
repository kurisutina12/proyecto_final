export default function authHeader() {

    const vuex = JSON.parse(
        localStorage.getItem('vuex')
    );

    if (vuex && vuex.token) {

        return {
            Authorization:
            'Bearer ' + vuex.token
        };
    }

    return {};
}