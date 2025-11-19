AOS.init({ duration:1000, once:true });

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Typewriter effect
const typeText = "Skip the Queue. Taste the Ease.";
const typeEl = document.querySelector(".typewriter");
let idx = 0;
function typeWriter() {
  if (idx < typeText.length) {
    typeEl.textContent += typeText.charAt(idx);
    idx++;
    setTimeout(typeWriter, 100);
  }
}
typeWriter();

// Floating icons random positions
const floatingIcons = document.querySelectorAll(".floating-icon");
floatingIcons.forEach((icon, i) => {
  icon.style.left = Math.random() * 80 + "vw";
  icon.style.top = Math.random() * 60 + "vh";
});

// Testimonials slider
$(document).ready(function(){
  $('.slider').slick({
    dots:true,
    arrows:false,
    infinite:true,
    slidesToShow: Math.min(3, $('.testimonial').length),
    slidesToScroll:1,
    autoplay:true,
    autoplaySpeed:3000,
    responsive:[
      { breakpoint:1024, settings:{ slidesToShow:2 } },
      { breakpoint:768, settings:{ slidesToShow:1 } }
    ]
  });
});
