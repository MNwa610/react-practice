import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      setStats({
        total: technologies.length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        completed: technologies.filter(t => t.status === 'completed').length
      });
    }
  }, []);

  return (
    <div className="page">
      <h1>Добро пожаловать в Трекер технологий!</h1>
      <p className="home-subtitle">Отслеживайте прогресс изучения технологий в одном удобном месте.</p>
      
      <div className="home-stats">
        <div className="stat-item">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Всего технологий</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">В процессе изучения</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Изучено</div>
        </div>
      </div>

      <div className="features">
        <h2>Возможности приложения:</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Добавление технологий</h3>
            <p>Создавайте список технологий, которые хотите изучить</p>
          </div>
          <div className="feature-card">
            <h3>Отслеживание прогресса</h3>
            <p>Отмечайте статус изучения: не начато, в процессе, завершено</p>
          </div>
          <div className="feature-card">
            <h3>Визуализация статистики</h3>
            <p>Наглядные графики и диаграммы вашего прогресса</p>
          </div>
          <div className="feature-card">
            <h3>Сохранение данных</h3>
            <p>Все данные хранятся локально в вашем браузере</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Быстрый старт:</h3>
        <div className="action-buttons">
          <Link to="/technologies" className="btn btn-primary btn-large">
            Посмотреть все технологии
          </Link>
          <Link to="/add-technology" className="btn btn-fourght btn-large">
            Добавить новую технологию
          </Link>
          <Link to="/statistics" className="btn btn-fourght btn-large">
            Посмотреть статистику
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;