class sliderAwesome {
  constructor(sliderClass = '.awesome-slider', slideClass = '.awesome-slider__slide', activeClass = 'active') {
    this.slider = document.querySelector(sliderClass)
    this.slides = document.querySelectorAll(slideClass)
    this.curentSlide = document.querySelector('[data-counter="value"]')
    this.totalSlides = document.querySelector('[data-counter="total"]')
    this.activeClass = activeClass
    this.curentIndex = 0

    this.slider.addEventListener('click', event => {
      if(event.target.dataset.btn === 'next') {
        this.nextSlide()
      }else if(event.target.dataset.btn === 'prev') {
        this.prevSlide()
      }
    })

    this.totalSlides.innerHTML = this.slides.length
    this.__setValue(this.curentIndex + 1)
  }

  __removeActiveClass() {
    this.slides.forEach(slide => {
      slide.classList.remove(this.activeClass)
    })
  }

  __addActiveClass(index) {
    this.slides[index].classList.add(this.activeClass)
  }

  __setCurentIndex(index) {
    if(index > this.slides.length - 1) {
      this.curentIndex = 0
    } else if(index < 0) {
      this.curentIndex = this.slides.length - 1
    } else {
      this.curentIndex = index
    }
  }

  __setValue(curentSlide) {
    this.curentSlide.innerHTML = curentSlide
  }

  nextSlide() {
    this.__removeActiveClass()
    this.__setCurentIndex(this.curentIndex + 1)
    this.__setValue(this.curentIndex + 1)
    this.__addActiveClass(this.curentIndex)
  }

  prevSlide() {
    this.__removeActiveClass()
    this.__setCurentIndex(this.curentIndex - 1)
    this.__setValue(this.curentIndex + 1)
    this.__addActiveClass(this.curentIndex)  
  } 

}