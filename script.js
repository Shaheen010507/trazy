
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Your message has been sent! We’ll get back to you soon.");
    form.reset();
  });
});
