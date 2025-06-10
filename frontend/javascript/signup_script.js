document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signUpBtn = document.getElementById('signUpBtn');
    const messageContainer = document.getElementById('messageContainer');

    if (!signupForm) return;

    function showMessage(message, type) {
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        messageContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function hideMessage() {
        messageContainer.innerHTML = '';
    }

    function setLoading(isLoading) {
        signUpBtn.disabled = isLoading;
        signUpBtn.textContent = isLoading ? 'Signing Up...' : 'Sign Up';
        const inputs = signupForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.disabled = isLoading;
        });
    }

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideMessage();
        setLoading(true);

        const formData = new FormData(signupForm);
        const signupData = {
            username: formData.get('username').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password')
        };

        if (!signupData.username || !signupData.email || !signupData.password) {
            showMessage('Please fill in all fields.', 'error');
            setLoading(false);
            return;
        }

        if (signupData.password.length < 6) {
            showMessage('Password must be at least 6 characters long.', 'error');
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupData.email)) {
            showMessage('Please enter a valid email address.', 'error');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(
                    `Success! A verification email has been sent to ${signupData.email}. Please check your inbox and click the verification link to complete your registration.`,
                    'success'
                );
                signupForm.reset();
            } else {
                showMessage(
                    result.detail || 'An error occurred during signup. Please try again.',
                    'error'
                );
            }
        } catch (error) {
            showMessage(
                'Network error. Please check your connection and try again.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    });

    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#dc3545';
            } else if (email) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }

    // Real-time password validation
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            if (password.length > 0 && password.length < 6) {
                this.style.borderColor = '#dc3545';
            } else if (password.length >= 6) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }
});