const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}
function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('_lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('_lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});


function testWebP(callback) {

	let webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

document.addEventListener("DOMContentLoaded", function () {

	let person = {
		name: 'Иван Иванович',
		phone: '+ 7 (929) 572-86-00',
		email: 'ivanivan@ingos.ru',
	}

	console.log(person.name);
	console.log(person.phone);
	console.log(person.email);

	let wrapInputs = document.querySelectorAll('.form__inputs')
	let inputs = document.querySelectorAll('.form__input')

	wrapInputs.forEach(function (item, index) {
		item.addEventListener('click', function (e) {
			item.classList.remove('_error')
			inputs[index].classList.remove('_error')
		});
	});

	// начало скрипта маски на телефон

	let phoneInputs = document.querySelectorAll('input[data-tel-input]');

	let getInputNumbersValue = function (input) {
		// Return stripped input value — just numbers
		return input.value.replace(/\D/g, '');
	}

	let onPhonePaste = function (e) {
		let input = e.target,
			inputNumbersValue = getInputNumbersValue(input);
		let pasted = e.clipboardData || window.clipboardData;
		if (pasted) {
			let pastedText = pasted.getData('Text');
			if (/\D/g.test(pastedText)) {
				// Attempt to paste non-numeric symbol — remove all non-numeric symbols,
				// formatting will be in onPhoneInput handler
				input.value = inputNumbersValue;
				return;
			}
		}
	}

	let onPhoneInput = function (e) {
		let input = e.target,
			inputNumbersValue = getInputNumbersValue(input),
			selectionStart = input.selectionStart,
			formattedInputValue = "";

		if (!inputNumbersValue) {
			return input.value = "";
		}

		if (input.value.length != selectionStart) {
			// Editing in the middle of input, not last symbol
			if (e.data && /\D/g.test(e.data)) {
				// Attempt to input non-numeric symbol
				input.value = inputNumbersValue;
			}
			return;
		}

		if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
			if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
			let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+ 7";
			formattedInputValue = input.value = firstSymbols + " ";
			if (inputNumbersValue.length > 1) {
				formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
			}
			if (inputNumbersValue.length >= 5) {
				formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
			}
			if (inputNumbersValue.length >= 8) {
				formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
			}
			if (inputNumbersValue.length >= 10) {
				formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
			}
		} else {
			formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
		}
		input.value = formattedInputValue;
	}
	let onPhoneKeyDown = function (e) {
		// Clear input after remove last symbol
		let inputValue = e.target.value.replace(/\D/g, '');
		if (e.keyCode == 8 && inputValue.length == 1) {
			e.target.value = "";
		}
	}
	for (let phoneInput of phoneInputs) {
		phoneInput.addEventListener('keydown', onPhoneKeyDown);
		phoneInput.addEventListener('input', onPhoneInput, false);
		phoneInput.addEventListener('paste', onPhonePaste, false);
	}

	// конец скрипта маски на телефон


	// начало скрипта валидации инпутов

	const form = document.querySelector('.form');

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		formSend(form)
	});

	async function formSend(form) {

		let error = formValidate(form);

		if (error === 0) {
			let popup = document.querySelector('.popup')
			popup.classList.add('open')
			form.reset();
			for (let i of wrapInputs) {
				i.classList.remove('_validate')
			}
		}
	}

	function formValidate(form) {
		let error = 0;
		let requireInfo = form.querySelectorAll('.form__require');
		let formReq = form.querySelectorAll('._reg');
		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			const inputReq = requireInfo[index];
			formRemoveError(input)
			input.parentElement.classList.add('_validate');
			if (input.value === '') {
				formAddError(input);
				error++;
				inputReq.innerHTML = 'Заполните поле.';
			} else if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
				if (input.value != person.email) {
					error++;
					formAddError(input);
					inputReq.innerHTML = 'Почта не найдена.';
				}
			} else if (input.classList.contains('_phone')) {
				if (input.value != person.phone) {
					error++;
					formAddError(input);
					inputReq.innerHTML = 'Номер не найден.';
				}
			} else if (input.classList.contains('_username')) {
				if (input.value != person.name) {
					console.log(input.value);
					error++;
					formAddError(input);
					inputReq.innerHTML = 'Проверьте поле на правильность заполения.';
				}
			} else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
				formAddError(input);
				error++;
			}
		}
		return error;
	};

	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
		input.parentElement.classList.remove('_validate');
	};
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	};
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)
	};

	// конец скрипта валидации инпутов


})

