document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Debug log
    
    const signupForm = document.getElementById('signupForm');
    const signUpBtn = document.getElementById('signUpBtn');
    const messageContainer = document.getElementById('messageContainer');

    // Check if elements exist
    if (!signupForm) {
        console.error('Signup form not found!');
        return;
    }

    console.log('Signup form found, attaching event listener'); // Debug log

    function showMessage(message, type) {
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        messageContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function hideMessage() {
      const messageContainer = document.getElementById('messageContainer');
      if (messageContainer) {
          messageContainer.innerHTML = '';
          messageContainer.scrollIntoView({ behavior: 'smooth' });
      }
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
        console.log('Form submitted!'); // Debug log
        e.preventDefault(); // This MUST be first
        e.stopPropagation(); // Add this too

        hideMessage();
        setLoading(true);

        const formData = new FormData(signupForm);
        const username = formData.get('username') || '';
        const email = formData.get('email') || '';
        const password = formData.get('password') || '';

        const signupData = {
            username: username.trim(),
            email: email.trim(),
            password: password
        };
        for (let [key, value] of formData.entries()) {
          console.log(`Field: ${key} = ${value}`);
        } 




        console.log('Signup data:', signupData); // Debug log

        // Validation
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
            console.log('Making fetch request to:', 'http://127.0.0.1:8000/api/signup'); // Debug log
            
            const response = await fetch('http://127.0.0.1:8000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            console.log('Response received:', response.status); // Debug log

            const result = await response.json();
            console.log('Response data:', result); // Debug log

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
            console.error('Signup error:', error);
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
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '#28a745';
                }
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

// // Get all users from main.py
// fetch('http://localhost:8000/api/users')
//   .then(response => response.json())
//   .then(data => console.log(data));

// // Add a user
// fetch('http://localhost:8000/api/users', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
// })
//   .then(response => response.json())
//   .then(data => console.log(data));

// // Delete a user
// fetch('http://localhost:8000/api/users/1', {
//   method: 'DELETE'
// })
//   .then(response => response.json())
//   .then(data => console.log(data));