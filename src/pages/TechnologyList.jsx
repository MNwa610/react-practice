import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import TechnologyCard from '../components/TechnologyCard';
import SearchBar from '../components/SearchBar';
import BulkStatusEditor from '../components/BulkStatusEditor';

function TechnologyList() {
  const [technologies, setTechnologies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkEditor, setShowBulkEditor] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const searchTechnologies = (query) => {
    setSearchQuery(query);
  };

  const filteredTechnologies = useMemo(() => {
    let result = technologies;

    if (filter !== 'all') {
      result = result.filter(tech => tech.status === filter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tech => 
        tech.title.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        (tech.notes && tech.notes.toLowerCase().includes(query))
      );
    }

    return result;
  }, [technologies, filter, searchQuery]);

  const handleBulkStatusUpdate = (updates) => {
    const updatedTechnologies = technologies.map(tech => {
      const update = updates.find(u => u.id === tech.id);
      if (update) {
        return {
          ...tech,
          status: update.status,
          updatedAt: update.updatedAt
        };
      }
      return tech;
    });

    setTechnologies(updatedTechnologies);
    localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    setShowBulkEditor(false);
    alert(`Статусы ${updates.length} технологий успешно обновлены!`);
  };

  const getStatusCount = (status) => {
    return technologies.filter(tech => tech.status === status).length;
  };

  const searchResultsCount = filteredTechnologies.length;
  const totalCount = technologies.length;

  if (showBulkEditor) {
    return (
      <div className="page">
        <BulkStatusEditor
          technologies={technologies}
          onSave={handleBulkStatusUpdate}
          onCancel={() => setShowBulkEditor(false)}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Все технологии</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowBulkEditor(true)}
            className="btn btn-secondary"
          >
            Массовое редактирование
          </button>
          <Link to="/add-technology" className="btn btn-primary">
            Добавить технологию
          </Link>
        </div>
      </div>

      <div className="search-section">
        <SearchBar 
          onSearch={searchTechnologies}
          placeholder="Поиск по названию, описанию или заметкам..."
        />
      </div>

      <div className="filters">
        <button 
          onClick={() => setFilter('all')} 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          Все ({totalCount})
        </button>
        <button 
          onClick={() => setFilter('not-started')} 
          className={`filter-btn ${filter === 'not-started' ? 'active' : ''}`}
        >
          Не начато ({getStatusCount('not-started')})
        </button>
        <button 
          onClick={() => setFilter('in-progress')} 
          className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
        >
          В процессе ({getStatusCount('in-progress')})
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        >
          Завершено ({getStatusCount('completed')})
        </button>
      </div>

      {(searchQuery || filter !== 'all') && (
        <div className="results-info">
          <p>
            Найдено: <strong>{searchResultsCount}</strong>
            {searchQuery && ` по запросу "${searchQuery}"`}
            {filter !== 'all' && ` со статусом "${
              filter === 'not-started' ? 'Не начато' : 
              filter === 'in-progress' ? 'В процессе' : 'Завершено'
            }"`}
          </p>
          {(searchQuery || filter !== 'all') && (
            <button 
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="btn btn-outline btn-sm"
            >
              Сбросить
            </button>
          )}
        </div>
      )}

      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <TechnologyCard key={tech.id} technology={tech} />
        ))}
      </div>

      {technologies.length === 0 && (
        <div className="empty-state">
          <p>Технологий пока нет.</p>
          <div className="action-buttons">
            <Link to="/add-technology" className="btn btn-primary">
              Добавить первую технологию
            </Link>
          </div>
        </div>
      )}

      {technologies.length > 0 && filteredTechnologies.length === 0 && (
        <div className="empty-state">
          <p>Ничего не найдено.</p>
          <button 
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="btn btn-secondary"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}

export default TechnologyList;