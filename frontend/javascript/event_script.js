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

  // Logo click logic
  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = '../../index.html';
    });
  }

  // Hover effect logic
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

  // Event inquiry form logic
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
      alert('Failed to send inquiry. Try again');
    }
  }

  const eventInquiryForm = document.getElementById('eventInquiryForm');
  if (eventInquiryForm) {
    eventInquiryForm.addEventListener('submit', handleEventInquirySubmit);
  }
    
    // Find elements
    const hamburgerButton = document.querySelector('.hamburger-menu');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const nav = document.querySelector('nav');
    
    console.log('Hamburger button:', hamburgerButton);
    console.log('Mobile dropdown:', mobileDropdown);
    console.log('Nav element:', nav);

    if (!hamburgerButton) {
        console.error('Hamburger button not found!');
        return;
    }
    if (!mobileDropdown) {
        console.error('Mobile dropdown not found!');
        return;
    }
    
    let isMenuOpen = false;
    
    function toggleMenu() {
        console.log('Toggle menu clicked, current state:', isMenuOpen);
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileDropdown.classList.add('active');
            console.log('Menu opened');
        } else {
            mobileDropdown.classList.remove('active');
            console.log('Menu closed');
        }
        // Update aria-expanded attribute for accessibility  
        hamburgerButton.setAttribute('aria-expanded', isMenuOpen);

        // Change hamburger icon to X when open
        const svg = hamburgerButton.querySelector('svg');
        const path = svg.querySelector('path');
        if (svg && path) {
            if (isMenuOpen) {
                path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z');
            } else {
                path.setAttribute('d', 'M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z');
            }
        }
    }
    
    // Add click event listener
    hamburgerButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked');
        toggleMenu();
    });
    
    // Close menu when clicking on a link
    mobileDropdown.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            console.log('Link clicked, closing menu');
            if (isMenuOpen) {
                toggleMenu();
            }
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !hamburgerButton.contains(e.target) && !mobileDropdown.contains(e.target)) {
            console.log('Clicked outside, closing menu');
            toggleMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('Escape pressed, closing menu');
            toggleMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            console.log('Window resized to desktop, closing menu');
            toggleMenu();
        }
    });
    
    console.log('Mobile menu initialization complete');
});