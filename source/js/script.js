let slides = document.querySelectorAll(".header__content");
let sliderDots = document.querySelectorAll(".header__dot");
let prevBtn = document.querySelector(".header__click-back");
let nextBtn = document.querySelector(".header__click-next");
let slideIndex = 1;

// showSlides(slideIndex);

function showSlides (n) {
    if (n < 1) {
        slideIndex = slides.length;
    } else if (n > slides.length) {
        slideIndex = 1
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("header__content--show");
    }
    for (i = 0; i < dots.length; i++) {
        sliderDots[i].classList.remove("header__dot--active");
    }
    slides[slideIndex - 1].classList.add("header__content--show");
    sliderDots[slideIndex - 1].classList.add("header__dot--active");
}
