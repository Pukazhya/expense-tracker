const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = registerForm.querySelector('button');
    button.disabled = true;
    button.textContent = 'Creating account...';

    try {
        const user = {
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value
        };

        localStorage.setItem('expensioUser', JSON.stringify(user));
        localStorage.setItem('expensioToken', 'demo-token');

        window.location.replace('dashboard.html');

    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Create account';
    }
});