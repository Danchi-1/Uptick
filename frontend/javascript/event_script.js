document.addEventListener('DOMContentLoaded', () => {
  // Signup logic
  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('registered', 'true');
    });
  }

  // Book Now logic
  const bookNowBtn = document.getElementById('bookNowBtn');
  if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
      if (localStorage.getItem('registered') === 'true') {
        window.location.href = '../html/booking.html';
      } else {
        if (confirm('You need to sign up before booking. Go to sign up page?')) {
          window.location.href = '../html/signup.html';
        }
      }
    });
  }
  const logo = document.getElementById('logo');
  if (logo) {
      logo.addEventListener('click', () => {
      window.location.href = '../../index.html';
      });
    }

  const a_constant = document.getElementsByClassName('c');
  const a_vary = document.getElementsByTagName('a');
  let originalBg = [];
  for (let j = 0; j < a_constant.length; j++) {
    originalBg[j] = a_constant[j].style.backgroundColor;
  }
  for (let i = 0; i < a_vary.length; i++) {
    a_vary[i].addEventListener('mouseover', () => {
      for (let j = 0; j < a_constant.length; j++) {
        a_constant[j].style.backgroundColor = 'var(--primary-color)';
      }
    });
    a_vary[i].addEventListener('mouseout', () => {
      for (let j = 0; j < a_constant.length; j++) {
        a_constant[j].style.backgroundColor = originalBg[j] || '';
      }
    });
  }

  async function handleEventInquirySubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/send-inquiry', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Inquiry sent successfully!');

    } else {
      alert('Failed to send inquiry. Try again')
    }
  }

  const eventInquiryForm = document.getElementById('eventInquiryForm');
  if (eventInquiryForm) {
    eventInquiryForm.addEventListener('submit', handleEventInquirySubmit);
  }
});