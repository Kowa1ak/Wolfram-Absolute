# WolframAbsoluteBackend

**Название проекта:** WolframAbsoluteBackend  
**Описание:** WolframAbsoluteBackend - это серверная часть для системы вычислений, которая включает в себя авторизацию, вычисления, историю операций и чат. Проект написан на Java и использует современные технологии для обеспечения надежной и масштабируемой работы.

## Стек технологий

- **Язык программирования:** Java
- **Веб-фреймворк:** Spring Boot
- **База данных:** MySQL
- **Документирование API:** Swagger
- **Контейнеризация:** Docker

## Frontend репозиторий
[Тык](https://github.com/SoTokcuk/WolframAbsolute/tree/front-end)

## Инструкция по развертыванию и настройке проекта для локального запуска

### Настройка окружения
Убедитесь, что у Вас установлен JDK версии не ниже 17, MySQL Server, а также Node.js с npm.

### Развертывание Backend части

```bash
git clone https://github.com/SoTokcuk/WolframAbsoluteBackend.git
cd WolframAbsoluteBackend
mvn clean install
mvn spring-boot:run
```
### Развертывание Frontend части

```bash
git clone https://github.com/SoTokcuk/WolframAbsolute.git
cd WolframAbsolute
npm install
ng serve
```

## Инструкция по развертыванию и настройке проекта в Docker

### Клонируйте репозитории проекта на локальный компьютер:

```bash
git clone https://github.com/SoTokcuk/WolframAbsoluteBackend.git
git clone https://github.com/SoTokcuk/WolframAbsolute.git
```

### Убедитесь, что на вашем компьютере установлен Docker

### Откройте терминал или командную строку и перейдите в корневую папку проекта, где находится файл docker-compose.yml

*Выполните команду*
```bash
docker-compose up --build
```

### После того, как все контейнеры будут запущены, вы сможете получить доступ к вашему приложению двумя способами
- **Откройте веб-браузер и перейдите по адресу `http://localhost:4200`**
- **Вы можете отправлять запросы к API, используя адрес `http://localhost:8080`**

## Документирование API - Swagger
Документация API доступна по адресу `http://localhost:8080/swagger-ui.html`

## Работа проекта

### Вычисления
![Вычисления](./docs/vid0.gif)

![Вычисления](./docs/vid1.gif)

![Вычисления](./docs/vid2.gif)

![Вычисления](./docs/vid3.gif)

### Экран логина
![Экран логина](./docs/login_page.png)

### Экран регистрации
![Экран логина](./docs/reg_page.png)

### Главная страница
![Главная страница](./docs/main_page.png)

### Чат
![Чат](./docs/chat_page.png)

## Прмиер логов

```bash
24-05-28 00:05:45 INFO  CalculationsController:199 - Compound interest calculation completed with 5 years of data.
2024-05-28 00:06:00 INFO  CalculationsController:155 - Received number system conversion request: NumSysConverterRequest(email=tester@g, number=46, library=Java, base1=10, base2=3)
2024-05-28 00:06:00 INFO  NumberSystemConverter:13 - Starting base conversion for number: 46 from base 10 to base 3
2024-05-28 00:06:00 INFO  NumberSystemConverter:16 - Conversion successful. Result: 1201
2024-05-28 00:06:00 INFO  CalculationsController:159 - Number system conversion result: 1201
2024-05-28 00:06:20 INFO  CalculationsController:102 - Received sys solving calculation request: SlauRequest(equations={34, 46 | 875}, {2, 34 | 45}, threads=2, library=Java, email=tester@g)
2024-05-28 00:06:20 INFO  CalculationsController:113 - calculation result: {Result=26.01503759398496 -0.20676691729323304, Time: 0.0010998 seconds}
```

## Схема базы данных

![Схема базы данных](./docs/db_scheme.png)
