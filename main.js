// Хранилища для номеров
const numbersList = {
    telegram: [],
    viber: []
};

// Добавление номера в список
function addNumber(platform) {
    const numberInput = document.getElementById(`${platform}Number`);
    const number = numberInput.value.trim();

    if (number && !numbersList[platform].includes(number)) {
        numbersList[platform].push(number);
        renderNumbers(platform);
        numberInput.value = ''; // Очистка поля ввода
    } else {
        alert('Этот номер уже добавлен или поле пустое.');
    }
}

// Рендер списка номеров
function renderNumbers(platform) {
    const listElement = document.getElementById(`${platform}NumbersList`);
    listElement.innerHTML = ''; // Очищаем список

    numbersList[platform].forEach((number, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            ${number}
            <button class="btn btn-danger btn-sm" onclick="removeNumber('${platform}', ${index})">Удалить</button>
        `;
        listElement.appendChild(listItem);
    });
}

// Удаление номера
function removeNumber(platform, index) {
    numbersList[platform].splice(index, 1);
    renderNumbers(platform);
}

// Отправка сообщения
function sendMessage(platform) {
    const message = document.getElementById(`${platform}Message`).value.trim();
    const numbers = numbersList[platform];

    if (message && numbers.length > 0) {
        const url = platform === 'telegram' ? '/sendTelegram' : '/sendViber';

        // Отображаем индикатор загрузки
        const sendButton = document.getElementById(`${platform}SendButton`);
        sendButton.disabled = true;
        sendButton.textContent = 'Отправка...';

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
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при отправке сообщения.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.success ? data.message : 'Ошибка при отправке сообщения.');
        })
        .catch((error) => {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке сообщения.');
        })
        .finally(() => {
            // Возвращаем состояние кнопки
            sendButton.disabled = false;
            sendButton.textContent = 'Отправить сообщение';
        });
    } else {
        alert('Пожалуйста, введите сообщение и номера.');
    }
}
