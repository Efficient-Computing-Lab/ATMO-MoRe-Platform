export async function getCSRFToken() {
    const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/security/csrf/`, {
        credentials: 'include',
    });
    const cookies = document.cookie.split("; ");
    const csrfCookie = cookies.find(cookie => cookie.startsWith("csrftoken="));
    return csrfCookie?.split("=")[1] || "";
}