import { Link } from 'react-router-dom';

function TechnologyCard({ technology }) {
  const getStatusText = (status) => {
    const statusMap = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'not-started': '⭕',
      'in-progress': '🟡',
      'completed': '✅'
    };
    return iconMap[status] || '📝';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="technology-card">
      <div className="tech-card-header">
        <h3 className="tech-title">{technology.title}</h3>
        <span className={`status status-${technology.status}`}>
          {getStatusIcon(technology.status)} {getStatusText(technology.status)}
        </span>
      </div>

      <div className="tech-card-body">
        <p className="tech-description">
          {technology.description.length > 150 
            ? `${technology.description.substring(0, 150)}...`
            : technology.description
          }
        </p>

        {technology.notes && (
          <div className="tech-notes-preview">
            <span className="notes-label">Заметки:</span>
            <p className="notes-text">
              {technology.notes.length > 100
                ? `${technology.notes.substring(0, 100)}...`
                : technology.notes
              }
            </p>
          </div>
        )}
      </div>

      <div className="tech-card-footer">
        <div className="tech-meta">
          <span className="tech-date">
            📅 {technology.createdAt ? formatDate(technology.createdAt) : 'Дата не указана'}
          </span>
        </div>
        
        <div className="tech-actions">
          <Link 
            to={`/technology/${technology.id}`} 
            className="btn btn-primary btn-sm"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TechnologyCard;