import { useState } from 'react';
import { useNotification } from '../components/NotificationProvider';
import ThemeToggle from '../components/ThemeToggle';

function Settings({ isDarkMode, onToggleTheme }) {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'ru',
    notifications: true,
    autoSave: true
  });

  const { showNotification } = useNotification();

  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const exportData = () => {
    const technologies = localStorage.getItem('technologies');
    const dataStr = JSON.stringify(JSON.parse(technologies || '[]'), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'technologies-backup.json';
    link.click();
    showNotification('Данные успешно экспортированы', 'success');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          localStorage.setItem('technologies', JSON.stringify(data));
          showNotification('Данные успешно импортированы', 'success');
          window.location.reload();
        } catch (error) {
          showNotification('Ошибка при импорте данных: неверный формат файла', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('technologies');
      showNotification('Все данные удалены', 'warning');
      window.location.reload();
    }
  };

  const addTestData = () => {
    const testTechnologies = [
      {
        id: 1,
        title: "React",
        description: "JavaScript библиотека для создания пользовательских интерфейсов",
        status: "in-progress",
        notes: "Изучаю хуки и контекст. Очень нравится компонентный подход!",
        createdAt: new Date('2024-01-15').toISOString()
      },
      {
        id: 2,
        title: "TypeScript",
        description: "Статически типизированное надмножество JavaScript",
        status: "completed",
        notes: "Отличная система типов, помогает избегать ошибок. Generics - мощный инструмент!",
        createdAt: new Date('2024-02-01').toISOString()
      },
      {
        id: 3,
        title: "Node.js",
        description: "Среда выполнения JavaScript на стороне сервера",
        status: "not-started",
        notes: "Планирую изучить для бэкенд-разработки и создания REST API",
        createdAt: new Date('2024-02-10').toISOString()
      },
      {
        id: 4,
        title: "MongoDB",
        description: "Документоориентированная NoSQL база данных",
        status: "in-progress",
        notes: "Разбираюсь с агрегациями и индексами. Гибкая схема данных - это удобно!",
        createdAt: new Date('2024-02-20').toISOString()
      },
      {
        id: 5,
        title: "Docker",
        description: "Платформа для контейнеризации приложений",
        status: "not-started",
        notes: "Хочу научиться контейнеризировать приложения для упрощения деплоя",
        createdAt: new Date('2024-03-01').toISOString()
      },
      {
        id: 6,
        title: "GraphQL",
        description: "Язык запросов для API и среда выполнения",
        status: "completed",
        notes: "Понравилась возможность запрашивать только нужные данные. Отличная альтернатива REST!",
        createdAt: new Date('2024-01-20').toISOString()
      }
    ];

    localStorage.setItem('technologies', JSON.stringify(testTechnologies));
    showNotification('Тестовые данные добавлены', 'success');
    window.location.reload();
  };

  const handleSave = () => {
    showNotification('Настройки сохранены', 'success');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Настройки приложения</h1>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Внешний вид</h3>
          
          <div className="setting-item">
            <label>Тема оформления:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <span>Светлая</span>
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
              <span>Тёмная</span>
            </div>
            <p>Переключение между светлой и тёмной темой оформления</p>
          </div>

          <div className="setting-item">
            <label>Язык:</label>
            <select 
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Поведение</h3>
          
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              Показывать уведомления
            </label>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              Автосохранение изменений
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Управление данными</h3>
          
          <div className="setting-item">
            <button onClick={addTestData} className="btn btn-third">
              Добавить тестовые данные
            </button>
            <p className="setting-description">
              Заполнить приложение демонстрационными технологиями для тестирования
            </p>
          </div>

          <div className="setting-item">
            <button onClick={exportData} className="btn btn-primary">
              Экспорт данных
            </button>
            <p className="setting-description">
              Скачайте резервную копию всех ваших технологий в формате JSON
            </p>
          </div>

          <div className="setting-item">
            <label className="file-input-label">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
              />
              <span className="btn btn-secondary">Импорт данных</span>
            </label>
            <p className="setting-description">
              Восстановите данные из ранее созданной резервной копии
            </p>
          </div>

          <div className="setting-item">
            <button onClick={clearAllData} className="btn btn-danger">
              Удалить все данные
            </button>
            <p className="setting-description warning">
              Внимание: это действие нельзя отменить! Все ваши технологии будут удалены.
            </p>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}

export default Settings;