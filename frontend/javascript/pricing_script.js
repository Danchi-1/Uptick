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

// Add smooth scrolling and interactive effects
document.querySelectorAll('.suite-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
            
    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('popular')) {
            this.style.transform = 'translateY(0) scale(1.05)';
        } else {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

        // Smooth scroll for book buttons
document.querySelectorAll('.book-btn, .book-now-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        // Add booking logic here
        alert('Booking system would be integrated here!');
    });
});

        // Logo click handler
document.getElementById('logo').addEventListener('click', function() {
    window.location.href = 'index.html';
});