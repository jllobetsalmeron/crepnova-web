// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-question');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Toggle active class on clicked item
            this.classList.toggle('active');
            
            // Toggle the answer visibility
            const answer = this.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
            
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== this && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.nextElementSibling;
                    otherAnswer.style.maxHeight = null;
                }
            });
        });
    });
    
    // Add animation classes for elements
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.platform-card, .step, .faq-item, .cta-section');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in-up');
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});
