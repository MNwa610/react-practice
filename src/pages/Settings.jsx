import { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'ru',
    notifications: true,
    autoSave: true
  });

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
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          localStorage.setItem('technologies', JSON.stringify(data));
          alert('Данные успешно импортированы!');
          window.location.reload();
        } catch (error) {
          alert('Ошибка при импорте данных: неверный формат файла');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('technologies');
      alert('Все данные удалены');
      window.location.reload();
    }
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
            <select 
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="light">Светлая</option>
              <option value="dark">Темная</option>
              <option value="auto">Системная</option>
            </select>
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
    </div>
  );
}

export default Settings;