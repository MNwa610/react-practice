import { useGitHubStats, formatGitHubNumber } from '../Hooks/useGitHubStats';

function GitHubStats({ techName }) {
  const { stats, loading, error, apiStatus, checkApiAvailability } = useGitHubStats(techName);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('ru-RU');
  };

  const getApiStatusInfo = () => {
    switch (apiStatus) {
      case 'checking':
        return { text: 'Проверка доступа к GitHub API...', type: 'checking' };
      case 'available':
        return { text: 'GitHub API доступен ✅', type: 'available' };
      case 'unavailable':
        return { text: 'GitHub API недоступен ❌', type: 'unavailable' };
      default:
        return { text: 'Статус неизвестен', type: 'unknown' };
    }
  };

  const apiStatusInfo = getApiStatusInfo();

  if (!techName) return null;

  return (
    <div className="github-stats">
      <div className="github-stats-header">
        <h3>GitHub Статистика</h3>
        <div className="api-status-container">
          <span className={`api-status api-status-${apiStatusInfo.type}`}>
            {apiStatusInfo.text}
          </span>
          {stats?.apiInfo && (
            <span className="api-rate-limit">
              {stats.apiInfo.remaining}/{stats.apiInfo.limit} запросов
            </span>
          )}
        </div>
      </div>

      {stats?.apiInfo && (
        <div className="api-info-panel">
          <div className="api-info-item">
            <span className="api-info-label">Лимит запросов:</span>
            <span className="api-info-value">{stats.apiInfo.limit}/час</span>
          </div>
          <div className="api-info-item">
            <span className="api-info-label">Осталось:</span>
            <span className={`api-info-value ${stats.apiInfo.remaining < 10 ? 'warning' : ''}`}>
              {stats.apiInfo.remaining}
            </span>
          </div>
          <div className="api-info-item">
            <span className="api-info-label">Сброс:</span>
            <span className="api-info-value">{formatTime(stats.apiInfo.reset)}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="github-loading">
          <div className="spinner"></div>
          <div className="loading-details">
            <span>Загружаем данные из GitHub...</span>
            <small>Ищем репозитории и статистику по "{techName}"</small>
          </div>
        </div>
      )}

      {error && (
        <div className="github-error">
          <div className="error-header">
            <span className="error-icon">⚠️</span>
            <span className="error-title">Ошибка загрузки</span>
          </div>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button 
              onClick={checkApiAvailability}
              className="btn btn-outline btn-sm"
            >
              Проверить доступность API
            </button>
            <a 
              href="https://api.github.com/rate_limit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Проверить лимиты
            </a>
          </div>
        </div>
      )}

      {stats && !loading && (
        <div className="github-stats-content">
          <div className="github-overview">
            <div className="overview-item">
              <span className="overview-label">Всего репозиториев</span>
              <span className="overview-value highlight">
                {formatGitHubNumber(stats.repositoryCount)}
              </span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Популярность</span>
              <span className="overview-value">
                <div className="popularity-score">
                  {stats.popularityScore}/100
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${stats.popularityScore}%` }}
                    ></div>
                  </div>
                </div>
              </span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Статус API</span>
              <span className="overview-value api-status-indicator available">
                ✅ Активен
              </span>
            </div>
          </div>

          {stats.topRepositories.length > 0 && (
            <div className="github-section">
              <h4>Популярные репозитории</h4>
              <div className="repos-list">
                {stats.topRepositories.map((repo, index) => (
                  <div key={repo.fullName} className="repo-card">
                    <div className="repo-rank">#{index + 1}</div>
                    <div className="repo-content">
                      <div className="repo-header">
                        <a 
                          href={repo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="repo-name"
                        >
                          {repo.fullName}
                        </a>
                        <div className="repo-stats">
                          <span className="repo-stat" title="Звезды">
                                {formatGitHubNumber(repo.stars)}
                          </span>
                          <span className="repo-stat" title="Форки">
                                {formatGitHubNumber(repo.forks)}
                          </span>
                        </div>
                      </div>
                      {repo.description && (
                        <p className="repo-description">{repo.description}</p>
                      )}
                      <div className="repo-footer">
                        {repo.language && (
                          <span className="repo-language"> {repo.language}</span>
                        )}
                        <span className="repo-updated">
                            {formatDate(repo.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.topics.length > 0 && (
            <div className="github-section">
              <h4>Связанные темы</h4>
              <div className="topics-list">
                {stats.topics.map(topic => (
                  <span key={topic.name} className="topic-tag">
                    {topic.displayName || topic.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="data-source-info">
            <p className="data-source-note">
                Данные загружены из GitHub API в реальном времени
            </p>
            <div className="data-freshness">
              <span className="freshness-indicator live"></span>
              <span>Live данные</span>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !stats && apiStatus === 'available' && (
        <div className="github-no-data">
          <p>  Введите название технологии для загрузки статистики GitHub</p>
        </div>
      )}

      {apiStatus === 'unavailable' && !loading && (
        <div className="api-unavailable">
          <div className="unavailable-header">
            <span className="unavailable-icon"></span>
            <span className="unavailable-title">GitHub API недоступен</span>
          </div>
          <p className="unavailable-message">
            Не удалось подключиться к GitHub API. Возможные причины:
          </p>
          <ul className="unavailable-reasons">
            <li>• Превышен лимит запросов (60 в час для анонимных запросов)</li>
            <li>• Проблемы с интернет-соединением</li>
            <li>• Временные неполадки GitHub</li>
          </ul>
          <div className="unavailable-actions">
            <button 
              onClick={checkApiAvailability}
              className="btn btn-primary btn-sm"
            >
              Повторить проверку
            </button>
            <a 
              href="https://api.github.com/rate_limit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Проверить статус GitHub
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default GitHubStats;