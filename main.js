
const mouseBg = document.querySelector('.mouse-bg');

document.addEventListener('mousemove', (e) => {
    mouseBg.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});


const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});