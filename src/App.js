import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { lightTheme, darkTheme } from './styles/theme';
import { NotificationProvider } from './components/NotificationProvider';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'dark';
    setIsDarkMode(shouldBeDark);

    if (shouldBeDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const currentTheme = useMemo(() => 
    isDarkMode ? darkTheme : lightTheme,
    [isDarkMode]
  );

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  return (
    <NotificationProvider>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Router>
          <div className={`app ${isDarkMode ? 'dark-theme' : ''}`}>
            <Navigation isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/technologies" element={<TechnologyList />} />
                <Route path="/technology/:techId" element={<TechnologyDetail />} />
                <Route path="/add-technology" element={<AddTechnology />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;