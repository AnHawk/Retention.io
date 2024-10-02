// Хранилища для номеров
const telegramNumbers = [];
const viberNumbers = [];

// Добавление номера в список
function addNumber(platform) {
    const numberInput = document.getElementById(`${platform}Number`);
    const number = numberInput.value.trim();
    if (number) {
        const list = platform === 'telegram' ? telegramNumbers : viberNumbers;
        list.push(number);
        renderNumbers(platform);
        numberInput.value = ''; // Очистка поля ввода
    }
}

// Рендер списка номеров
function renderNumbers(platform) {
    const listElement = document.getElementById(`${platform}NumbersList`);
    const list = platform === 'telegram' ? telegramNumbers : viberNumbers;
    listElement.innerHTML = '';
    list.forEach((number, index) => {
        listElement.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${number}
                <button class="btn btn-danger btn-sm" onclick="removeNumber('${platform}', ${index})">Удалить</button>
            </li>
        `;
    });
}

// Удаление номера
function removeNumber(platform, index) {
    const list = platform === 'telegram' ? telegramNumbers : viberNumbers;
    list.splice(index, 1);
    renderNumbers(platform);
}

// Отправка сообщения
function sendMessage(platform) {
    const message = document.getElementById(`${platform}Message`).value;
    const numbers = platform === 'telegram' ? telegramNumbers : viberNumbers;
    if (message && numbers.length > 0) {
        const url = platform === 'telegram' ? '/sendTelegram' : '/sendViber';

        // Отправляем запрос на сервер для отправки сообщения
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numbers: numbers, // массив номеров или идентификаторов
                message: message, // сообщение
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
            } else {
                alert('Ошибка при отправке сообщения.');
            }
        })
        .catch((error) => {
            console.error('Ошибка:', error);
        });
    } else {
        alert('Пожалуйста, введите сообщение и номера.');
    }
}