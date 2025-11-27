import { useState, useEffect } from 'react';

function BulkStatusEditor({ technologies, onSave, onCancel }) {
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [newStatus, setNewStatus] = useState('not-started');
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredTechnologies = technologies.filter(tech => {
    if (filter === 'all') return true;
    return tech.status === filter;
  });

  const handleTechSelect = (techId) => {
    setSelectedTechs(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTechs([]);
    } else {
      setSelectedTechs(filteredTechnologies.map(tech => tech.id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (filteredTechnologies.length > 0) {
      setSelectAll(selectedTechs.length === filteredTechnologies.length);
    }
  }, [selectedTechs, filteredTechnologies]);

  const handleSave = () => {
    if (selectedTechs.length === 0) {
      alert('Выберите хотя бы одну технологию для изменения');
      return;
    }

    const updates = selectedTechs.map(techId => ({
      id: techId,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }));

    onSave(updates);
  };

  const getStatusText = (status) => {
    const statusMap = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[status] || status;
  };

  const statusStats = {
    'all': technologies.length,
    'not-started': technologies.filter(t => t.status === 'not-started').length,
    'in-progress': technologies.filter(t => t.status === 'in-progress').length,
    'completed': technologies.filter(t => t.status === 'completed').length
  };

  return (
    <div className="bulk-editor">
      <div className="bulk-editor-header">
        <h2>Массовое редактирование статусов</h2>
        <p>Выберите технологии и установите им новый статус</p>
      </div>

      <div className="bulk-controls">
        <div className="control-group">
          <label>Фильтр по статусу:</label>
          <div className="filter-buttons">
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              Все ({statusStats.all})
            </button>
            <button
              onClick={() => setFilter('not-started')}
              className={`filter-btn ${filter === 'not-started' ? 'active' : ''}`}
            >
              Не начато ({statusStats['not-started']})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            >
              В процессе ({statusStats['in-progress']})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            >
              Завершено ({statusStats.completed})
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Новый статус для выбранных:</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="status-select"
          >
            <option value="not-started">Не начато</option>
            <option value="in-progress">В процессе</option>
            <option value="completed">Завершено</option>
          </select>
        </div>

        <div className="selection-info">
          <span>Выбрано: <strong>{selectedTechs.length}</strong> технологий</span>
          {selectedTechs.length > 0 && (
            <button
              onClick={() => setSelectedTechs([])}
              className="btn btn-outline btn-sm"
            >
              Сбросить выбор
            </button>
          )}
        </div>
      </div>

      <div className="tech-list-container">
        <div className="list-header">
          <label className="select-all-label">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              disabled={filteredTechnologies.length === 0}
            />
            <span>Выбрать все</span>
          </label>
          <span className="showing-count">
            Показано: {filteredTechnologies.length} технологий
          </span>
        </div>

        <div className="tech-list">
          {filteredTechnologies.length === 0 ? (
            <div className="empty-list">
              <p>Технологии не найдены</p>
              <p>Измените фильтр или добавьте технологии</p>
            </div>
          ) : (
            filteredTechnologies.map(tech => (
              <div key={tech.id} className="tech-item">
                <label className="tech-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTechs.includes(tech.id)}
                    onChange={() => handleTechSelect(tech.id)}
                  />
                </label>
                
                <div className="tech-info">
                  <h4 className="tech-title">{tech.title}</h4>
                  <p className="tech-description">
                    {tech.description.length > 100 
                      ? `${tech.description.substring(0, 100)}...`
                      : tech.description
                    }
                  </p>
                  <div className="tech-meta">
                    <span className={`current-status status-${tech.status}`}>
                      {getStatusText(tech.status)}
                    </span>
                    <span className="tech-date">
                      {new Date(tech.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                <div className="tech-preview-status">
                  <span className="preview-label">Будет:</span>
                  <span className={`new-status status-${newStatus}`}>
                    {getStatusText(newStatus)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bulk-actions">
        <div className="actions-left">
          <span className="selection-summary">
            Готово обновить: <strong>{selectedTechs.length}</strong> технологий
          </span>
        </div>
        
        <div className="actions-right">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={selectedTechs.length === 0}
            className="btn btn-primary"
          >
            Применить к {selectedTechs.length} технологиям
          </button>
        </div>
      </div>

      {selectedTechs.length > 0 && (
        <div className="changes-preview">
          <h4>Предварительный просмотр изменений:</h4>
          <div className="changes-list">
            {filteredTechnologies
              .filter(tech => selectedTechs.includes(tech.id))
              .slice(0, 5)
              .map(tech => (
                <div key={tech.id} className="change-item">
                  <span className="tech-name">{tech.title}</span>
                  <span className="change-arrow">→</span>
                  <span className={`new-status status-${newStatus}`}>
                    {getStatusText(newStatus)}
                  </span>
                </div>
              ))
            }
            {selectedTechs.length > 5 && (
              <div className="more-items">
                и еще {selectedTechs.length - 5} технологий
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkStatusEditor;