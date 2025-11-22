import { useState, useEffect } from 'react';

export function useGitHubStats(techName) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); 

 
  const checkApiAvailability = async () => {
    try {
      const response = await fetch('https://api.github.com/rate_limit', {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        const rateLimit = await response.json();
        setApiStatus('available');
        return {
          available: true,
          limit: rateLimit.resources.core.limit,
          remaining: rateLimit.resources.core.remaining,
          reset: rateLimit.resources.core.reset
        };
      } else {
        setApiStatus('unavailable');
        return { available: false };
      }
    } catch (err) {
      setApiStatus('unavailable');
      return { available: false };
    }
  };

  useEffect(() => {

    checkApiAvailability();
  }, []);

  useEffect(() => {
    if (!techName || techName.trim() === '') {
      setStats(null);
      return;
    }

    const fetchGitHubStats = async () => {
      setLoading(true);
      setError(null);

      try {

        const apiCheck = await checkApiAvailability();
        if (!apiCheck.available) {
          throw new Error('GitHub API временно недоступен');
        }

        console.log(`GitHub API: ${apiCheck.remaining}/${apiCheck.limit} запросов осталось`);

        const reposResponse = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(techName)}+language:${encodeURIComponent(techName)}&sort=stars&order=desc&per_page=5`
        );

        if (reposResponse.status === 403) {
          throw new Error('Достигнут лимит запросов к GitHub API. Попробуйте позже.');
        }

        if (!reposResponse.ok) {
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }

        const reposData = await reposResponse.json();

        let topicsData = { items: [] };
        try {
          const topicsResponse = await fetch(
            `https://api.github.com/search/topics?q=${encodeURIComponent(techName)}&per_page=3`
          );
          if (topicsResponse.ok) {
            topicsData = await topicsResponse.json();
          }
        } catch (topicsError) {
          console.warn('Topics fetch failed:', topicsError);
        }

        const result = {
          repositoryCount: reposData.total_count,
          topRepositories: reposData.items.slice(0, 3).map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            language: repo.language,
            updatedAt: repo.updated_at
          })),
          topics: topicsData.items.map(topic => ({
            name: topic.name,
            displayName: topic.display_name
          })),
          popularityScore: calculatePopularityScore(reposData.total_count),
          apiInfo: apiCheck
        };

        setStats(result);
      } catch (err) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchGitHubStats, 500);
    return () => clearTimeout(timeoutId);
  }, [techName]);

  const calculatePopularityScore = (repoCount) => {
    if (repoCount === 0) return 0;
    if (repoCount > 100000) return 100;
    return Math.min(Math.round((repoCount / 100000) * 100), 100);
  };

  return {
    stats,
    loading,
    error,
    apiStatus,
    checkApiAvailability,
    refetch: () => {
      if (techName) {
        const fetchStats = async () => {
          setLoading(true);
          setError(null);

        };
        fetchStats();
      }
    }
  };
}

export const formatGitHubNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};