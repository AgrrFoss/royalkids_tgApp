'use client'
import dynamic from 'next/dynamic';

// Динамический импорт Snowfall с отключенным SSR
const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false });

const SnowBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2, // Убедитесь, что снег находится под основным контентом
        pointerEvents: 'none', // Снежинки не должны блокировать клики
      }}
    >
      <Snowfall
        // Количество снежинок
        snowflakeCount={100}
        // Цвет снежинок (например, белый)
        color="white"
        // Скорость падения
        speed={[0.2, 1.0]} // Минимальная и максимальная скорость
        // Размер снежинок
        radius={[0.5, 3.0]} // Минимальный и максимальный радиус
        // Сила ветра (горизонтальное смещение)
        wind={[-0.5, 2.0]} // Минимальная и максимальная сила ветра
        // Другие настройки можно посмотреть в документации react-snowfall
      />
    </div>
  );
};

export default SnowBackground;