export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
            <img
                src="/Simpleicons.png"
                alt="Simple Icons"
                className="w-full max-w-[300px] object-contain mb-6"
            />
            <h1 className="text-3xl font-bold mb-4 text-center">
                Добро пожаловать в систему расписания
            </h1>
            <p className="text-lg text-gray-700 max-w-md text-center">
                Это главная страница. Используйте боковое меню для перехода на другие страницы.
            </p>
        </div>
    );
}
