export default function HomePage() {
    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">Добро пожаловать в систему расписания</h1>
            <p className="text-lg text-gray-700">
                Это главная страница. Используй меню или перейди по ссылкам ниже:
            </p>

            <ul className="list-disc pl-6 mt-4 text-blue-600">
                <li>
                    <a href="/schedule" className="hover:underline">Посмотреть расписание</a>
                </li>
                <li>
                    <a href="/teachers" className="hover:underline">Преподаватели</a>
                </li>
                <li>
                    <a href="/classes" className="hover:underline">Классы</a>
                </li>
            </ul>
        </main>
    );
}
