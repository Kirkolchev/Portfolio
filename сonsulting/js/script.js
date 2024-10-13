"use strict"

const icon = document.querySelector('.icon-menu');
icon.addEventListener('click', function () {
	document.documentElement.classList.toggle('menu-open');
});

// COUNTER

// Функція ініціалізації цифрового лічильника
function digitsCountersInit(elements) {
	// Перевірка на наявність елемента
	let digitsCounters = elements ? elements : document.querySelectorAll('[data-digits-counter]')

	if (digitsCounters.length) {
		digitsCounters.forEach(digitsCounter => {
			digitsCountersAnimate(digitsCounter)
		})
	}
}

function easeOutQuad(num) {
	return 1 - Math.pow(1 - num, 2)
}

// Функція аніміції цифер лічильника
function digitsCountersAnimate(element) {
	let startTimestamp = null
	const duration = parseInt(element.dataset.digitsCounter) ? parseInt(element.dataset.digitsCounter) : 1000
	const startValue = parseInt(element.innerHTML)
	const startPosition = 0

	const parent = element.parentElement
	const svgIcon = parent.querySelector('[data-svg-counter]')
	if (svgIcon) {
		if (svgIcon.dataset.svgCounter == 'circle') {
			svgCounterInit(svgIcon, startValue, duration)
		}
	}

	const step = (timestamp) => {
		if (!startTimestamp) startTimestamp = timestamp
		const progress = Math.min((timestamp - startTimestamp) / duration, 1)
		element.innerHTML = Math.floor(easeOutQuad(progress) * (startPosition + startValue))
		if (progress < 1) {
			window.requestAnimationFrame(step)
		}
	}

	window.requestAnimationFrame(step)
}

// Функція ініціалізації svg-іконки цифрового лічильника
function svgCounterInit(element, percent, duration) {
	const svgCounter = element ? element : document.querySelector('[data-svg-counter]')

	if (svgCounter) {
		svgCircleAnimate(svgCounter, percent, duration)
	}
}

// Функція аніміції svg-circle іконки
function svgCircleAnimate(element, percent, duration) {
	const svgRadius = element.querySelector('circle').r.baseVal.value
	const circumference = Math.round(2 * Math.PI * svgRadius)
	const endPosition = Math.round(circumference / 100 * percent)
	let startTimestamp = null

	const step = (timestamp) => {
		if (!startTimestamp) startTimestamp = timestamp
		const progress = Math.min((timestamp - startTimestamp) / duration, 1)
		element.style.strokeDasharray = circumference
		element.style.strokeDashoffset = Math.floor(circumference - easeOutQuad(progress) * endPosition)
		if (progress < 1) {
			requestAnimationFrame(step)
		}
	}

	requestAnimationFrame(step)
}


let option = {
	root: null,
	rootMargin: "0px 0px 0px 0px",
	threshold: 0.5,
};

let observer = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const targetElement = entry.target
			const digitsCountersItems = targetElement.querySelectorAll('[data-digits-counter]')
			if (digitsCountersItems.length) {
				digitsCountersInit(digitsCountersItems)
			}

			observer.unobserve(targetElement)
		}
	})
}, option)

let cardsStats = document.querySelectorAll('.card--count')
if (cardsStats.length) {
	cardsStats.forEach(card => {
		observer.observe(card)
	})
}

// Навігація по сторінці 
document.addEventListener('click', documentAction)

function documentAction(e) {
	const targetElement = e.target

	// Навігація по сторінці
	if (targetElement.closest("[class*='menu__link']")) {
		if (document.documentElement.classList.contains('menu-open')) {
			document.documentElement.classList.remove('menu-open')
		}
		const link = targetElement.closest("[class*='menu__link']")
		const goto = link.dataset.goto
		const gotoElement = document.querySelector(goto)

		if (gotoElement) {
			gotoElement.scrollIntoView({
				behavior: "smooth"
			})
		}
		e.preventDefault()
	}
}