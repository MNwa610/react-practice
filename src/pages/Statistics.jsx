import { useState, useEffect } from 'react';

function Statistics() {
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const getStatusCount = (status) => {
    return technologies.filter(tech => tech.status === status).length;
  };

  const notStartedCount = getStatusCount('not-started');
  const inProgressCount = getStatusCount('in-progress');
  const completedCount = getStatusCount('completed');
  const totalCount = technologies.length;

  const completionPercentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Статистика</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Всего технологий</h3>
          <div className="stat-number">{totalCount}</div>
        </div>

        <div className="stat-card">
          <h3>Не начато</h3>
          <div className="stat-number">{notStartedCount}</div>
        </div>

        <div className="stat-card">
          <h3>В процессе</h3>
          <div className="stat-number">{inProgressCount}</div>
        </div>

        <div className="stat-card">
          <h3>Завершено</h3>
          <div className="stat-number">{completedCount}</div>
        </div>
      </div>

      <div className="progress-section">
        <h3>Общий прогресс</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p>{completionPercentage}% завершено</p>
      </div>

      {totalCount === 0 && (
        <div className="empty-state">
          <p>Нет данных для отображения статистики.</p>
          <p>Добавьте технологии для отслеживания прогресса.</p>
        </div>
      )}
    </div>
  );
}

export default Statistics;