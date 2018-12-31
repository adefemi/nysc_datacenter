const serverHost = 'http://localhost:8000/';
export function backEndLinks() {
    return{
        auth: serverHost+'auth/',
        refresh: serverHost+'auth/refresh/',
        member: serverHost+'member/',
        section: serverHost+'section/',
        cds: serverHost+'cds/',
    }
}
