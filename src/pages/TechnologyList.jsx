import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import TechnologyCard from '../components/TechnologyCard';
import SearchBar from '../components/SearchBar';

function TechnologyList() {
  const [technologies, setTechnologies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const searchTechnologies = (query) => {
    setSearchQuery(query.toLowerCase().trim());
  };


  const filteredTechnologies = useMemo(() => {
    let result = technologies;

    if (filter !== 'all') {
      result = result.filter(tech => tech.status === filter);
    }

    if (searchQuery) {
      result = result.filter(tech => 
        tech.title.toLowerCase().includes(searchQuery) ||
        tech.description.toLowerCase().includes(searchQuery) ||
        (tech.notes && tech.notes.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [technologies, filter, searchQuery]);

  const getStatusCount = (status) => {
    return technologies.filter(tech => tech.status === status).length;
  };

  const searchResultsCount = filteredTechnologies.length;
  const totalCount = technologies.length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Все технологии</h1>
        <Link to="/add-technology" className="btn btn-primary">
          + Добавить технологию
        </Link>
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
            Найдено технологий: <strong>{searchResultsCount}</strong>
            {searchQuery && (
              <span> по запросу "<strong>{searchQuery}</strong>"</span>
            )}
            {filter !== 'all' && (
              <span> со статусом "<strong>
                {filter === 'not-started' ? 'Не начато' : 
                 filter === 'in-progress' ? 'В процессе' : 'Завершено'}
              </strong>"</span>
            )}
          </p>
          {(searchQuery || filter !== 'all') && searchResultsCount > 0 && (
            <button 
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="btn btn-outline btn-sm"
            >
              Сбросить фильтры
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
          <p>Добавьте первую технологию или загрузите тестовые данные в настройках.</p>
          <div className="action-buttons">
            <Link to="/add-technology" className="btn btn-primary">
              Добавить первую технологию
            </Link>
            <Link to="/settings" className="btn btn-secondary">
              Загрузить тестовые данные
            </Link>
          </div>
        </div>
      )}

      {technologies.length > 0 && filteredTechnologies.length === 0 && (
        <div className="empty-state">
          <p>Технологии не найдены.</p>
          <p>Попробуйте изменить параметры поиска или сбросить фильтры.</p>
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