const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Вставьте ваши токены здесь
const TELEGRAM_BOT_TOKEN = 'ВАШ_ТЕЛЕГРАМ_БОТ_ТОКЕН'; // Вставьте сюда ваш токен от Telegram бота
const VIBER_BOT_TOKEN = 'ВАШ_ВАЙБЕР_БОТ_ТОКЕН'; // Вставьте сюда ваш токен от Viber бота

// Маршрут для отправки сообщения в Telegram
app.post('/sendTelegram', async (req, res) => {
    const { numbers, message } = req.body;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`; // Используем токен

    try {
        for (let number of numbers) {
            await axios.post(url, {
                chat_id: number, // Используем chat_id
                text: message,
            });
        }
        res.json({ success: true, message: 'Сообщения отправлены в Telegram' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ошибка при отправке сообщений в Telegram' });
    }
});

// Маршрут для отправки сообщения в Viber
app.post('/sendViber', async (req, res) => {
    const { numbers, message } = req.body;
    const url = 'https://chatapi.viber.com/pa/send_message'; // URL для Viber API

    try {
        for (let number of numbers) {
            await axios.post(url, {
                receiver: number, // id пользователя Viber
                min_api_version: 1,
                sender: {
                    name: "YourBotName",
                },
                type: "text",
                text: message,
            }, {
                headers: {
                    'X-Viber-Auth-Token': VIBER_BOT_TOKEN // Используем токен
                }
            });
        }
        res.json({ success: true, message: 'Сообщения отправлены в Viber' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ошибка при отправке сообщений в Viber' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
