import { config, logger } from '../config/environment';

/**
 * Environment Configuration Display Component
 * Shows configuration information in development mode
 */
export const EnvironmentDisplay = () => {
  // Only show in development mode
  if (!config.isDevelopment() || !config.DEBUG_MODE) {
    return null;
  }

  const handleCopyConfig = () => {
    const configInfo = `
TodoFlow Frontend Configuration:
- Environment: ${config.APP_ENVIRONMENT}
- API Base URL: ${config.API_BASE_URL}
- Default Theme: ${config.DEFAULT_THEME}
- Debug Mode: ${config.DEBUG_MODE}
- Features: ${Object.entries(config.FEATURES).filter(([, enabled]) => enabled).map(([name]) => name).join(', ')}
    `.trim();
    
    navigator.clipboard.writeText(configInfo).then(() => {
      logger.log('Configuration copied to clipboard');
    });
  };

  const handleTestAPI = async () => {
    try {
      const response = await fetch(config.API_BASE_URL.replace('/api', ''));
      const data = await response.json();
      logger.log('API Test Response:', data);
      alert(`API is reachable! Server: ${data.message}`);
    } catch (error) {
      logger.error('API Test Failed:', error);
      alert(`API test failed: ${error.message}`);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        🔧 {config.APP_NAME} Dev Mode
      </div>
      <div>Environment: {config.APP_ENVIRONMENT}</div>
      <div>API: {config.API_BASE_URL}</div>
      <div>Theme: {config.DEFAULT_THEME}</div>
      <div style={{ marginTop: '6px' }}>
        <button 
          onClick={handleCopyConfig}
          style={{ 
            background: 'none', 
            border: '1px solid white', 
            color: 'white', 
            padding: '2px 6px', 
            borderRadius: '3px',
            fontSize: '10px',
            marginRight: '4px',
            cursor: 'pointer'
          }}
        >
          Copy Config
        </button>
        <button 
          onClick={handleTestAPI}
          style={{ 
            background: 'none', 
            border: '1px solid white', 
            color: 'white', 
            padding: '2px 6px', 
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          Test API
        </button>
      </div>
    </div>
  );
};
