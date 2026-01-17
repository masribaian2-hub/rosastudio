document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-dark');
    btn.innerText = 'Sending...';
    
    setTimeout(() => {
        btn.innerText = 'Message Sent!';
        btn.style.backgroundColor = '#4a6d4a';
        this.reset();
    }, 1500);
});