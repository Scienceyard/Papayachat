
# Используем базовый образ Node.js
FROM node:20

# Создаём директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем всё остальное в контейнер
COPY . .

# Определяем порт
EXPOSE 8080

# Запуск сервера
CMD ["node", "index.js"]