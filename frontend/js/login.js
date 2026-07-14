const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = loginForm.querySelector('button');
    button.disabled = true;
    button.textContent = 'Logging in...';

    try {
        const email = document.querySelector('#email').value;

        localStorage.setItem(
            'expensioUser',
            JSON.stringify({
                name: 'PUKAZHYA',
                email: email
            })
        );

        localStorage.setItem(
            'expensioToken',
            'demo-token'
        );

        window.location.replace('dashboard.html');

    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Login';
    }
});