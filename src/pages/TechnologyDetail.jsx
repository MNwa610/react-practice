import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GitHubStats from '../components/GitHubStats';
import StudyTimelineForm from '../components/StudyTimelineForm';

function TechnologyDetail() {
  const { techId } = useParams();
  const [technology, setTechnology] = useState(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
    }
  }, [techId]);

  const updateStatus = (newStatus) => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology({ ...technology, status: newStatus });
    }
  };

  const saveStudyTimeline = (timelineData) => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) 
          ? { 
              ...tech, 
              studyTimeline: timelineData,
              hasStudyPlan: true
            } 
          : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology(updated.find(t => t.id === parseInt(techId)));
      setShowTimelineForm(false);
    }
  };

  const removeStudyTimeline = () => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) 
          ? { 
              ...tech, 
              studyTimeline: null,
              hasStudyPlan: false
            } 
          : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology(updated.find(t => t.id === parseInt(techId)));
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <h1>Технология не найдена</h1>
        <p>Технология с ID {techId} не существует.</p>
        <Link to="/technologies" className="btn">
          ← Назад к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <h1>{technology.title}</h1>
      </div>

      <div className="technology-detail">
        <div className="detail-section">
          <h3>Описание</h3>
          <p>{technology.description}</p>
        </div>

        <div className="detail-section">
          <h3>Статус изучения</h3>
          <div className="status-buttons">
            <button
              onClick={() => updateStatus('not-started')}
              className={technology.status === 'not-started' ? 'active' : ''}
            >
              Не начато
            </button>
            <button
              onClick={() => updateStatus('in-progress')}
              className={technology.status === 'in-progress' ? 'active' : ''}
            >
              В процессе
            </button>
            <button
              onClick={() => updateStatus('completed')}
              className={technology.status === 'completed' ? 'active' : ''}
            >
              Завершено
            </button>
          </div>
        </div>

        <div className="detail-section">
          <div className="section-header">
            <h3> План изучения</h3>
            {!technology.studyTimeline ? (
              <button 
                onClick={() => setShowTimelineForm(true)}
                className="btn btn-primary btn-sm"
              >
                + Установить сроки
              </button>
            ) : (
              <div className="timeline-actions">
                <button 
                  onClick={() => setShowTimelineForm(true)}
                  className="btn btn-outline btn-sm"
                >
                  ✏️ Редактировать
                </button>
                <button 
                  onClick={removeStudyTimeline}
                  className="btn btn-danger btn-sm"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>

          {showTimelineForm ? (
            <StudyTimelineForm
              technology={technology}
              onSave={saveStudyTimeline}
              onCancel={() => setShowTimelineForm(false)}
            />
          ) : technology.studyTimeline ? (
            <div className="study-timeline-preview">
              <div className="timeline-stats">
                <div className="timeline-stat">
                  <span className="stat-label">Начало: </span>
                  <span className="stat-value">
                    {new Date(technology.studyTimeline.startDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="timeline-stat">
                  <span className="stat-label">Окончание: </span>
                  <span className="stat-value">
                    {new Date(technology.studyTimeline.endDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="timeline-stat">
                  <span className="stat-label">Часов в неделю: </span>
                  <span className="stat-value">{technology.studyTimeline.hoursPerWeek}</span>
                </div>
                <div className="timeline-stat">
                  <span className="stat-label">Приоритет: </span>
                  <span className={`priority-badge priority-${technology.studyTimeline.priority}`}>
                    {technology.studyTimeline.priority}
                  </span>
                </div>
              </div>
              
              {technology.studyTimeline.milestones && technology.studyTimeline.milestones.length > 0 && (
                <div className="milestones-preview">
                  <h4>Вехи: </h4>
                  <div className="milestones-list">
                    {technology.studyTimeline.milestones.map((milestone, index) => (
                      <div key={index} className="milestone-preview">
                        <span className="milestone-title">{milestone.title } </span>
                        {milestone.date && (
                          <span className="milestone-date">
                            {new Date(milestone.date).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="no-timeline">План изучения не установлен</p>
          )}
        </div>

        <div className="detail-section">
          <h3>GitHub Статистика</h3>
          <GitHubStats techName={technology.title} />
        </div>

        {technology.notes && (
          <div className="detail-section">
            <h3>Мои заметки</h3>
            <p>{technology.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyDetail;