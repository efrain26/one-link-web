import { useState } from 'react';
import { useProjects } from './hooks/useProjects';
import '../App.css';

function App() {
  const { projects, loading, error, createProject } = useProjects();
  const [appName, setAppName] = useState('');
  const [iosUrl, setIosUrl] = useState('');
  const [androidUrl, setAndroidUrl] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [createdProject, setCreatedProject] = useState<{
    short_url: string;
    short_code: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createProject({
      app_name: appName,
      ios_url: iosUrl,
      android_url: androidUrl,
      ...(fallbackUrl && { fallback_url: fallbackUrl }),
    });

    if (result) {
      setCreatedProject({
        short_url: result.short_url,
        short_code: result.short_code,
      });
      // Limpiar formulario
      setAppName('');
      setIosUrl('');
      setAndroidUrl('');
      setFallbackUrl('');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        OneLink - Universal App Store Link Generator
      </h1>

      {/* Arquitectura Info */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #646cff', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
        <h2 style={{ marginTop: 0 }}>Arquitectura DDD + Clean Code</h2>
        <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li><strong>Domain Layer:</strong> Project Entity, Url Value Object, IProjectRepository</li>
          <li><strong>Application Layer:</strong> CreateProject, ListProjects, GetProjectByCode Use Cases</li>
          <li><strong>Infrastructure Layer:</strong> ProjectRepository, HttpClient</li>
          <li><strong>Presentation Layer:</strong> useProjects Hook, React Components</li>
        </ul>
      </div>

      {/* Create Project Form */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #333', borderRadius: '8px' }}>
        <h2>Crear Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre de la App:</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Ej: Mi App Increíble"
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>iOS App Store URL:</label>
            <input
              type="url"
              value={iosUrl}
              onChange={(e) => setIosUrl(e.target.value)}
              placeholder="https://apps.apple.com/app/id123456789"
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Android Play Store URL:</label>
            <input
              type="url"
              value={androidUrl}
              onChange={(e) => setAndroidUrl(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=com.example.app"
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Fallback URL (opcional):</label>
            <input
              type="url"
              value={fallbackUrl}
              onChange={(e) => setFallbackUrl(e.target.value)}
              placeholder="https://www.example.com"
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creando...' : 'Crear Proyecto'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ff4444', borderRadius: '8px' }}>
            Error: {error}
          </div>
        )}

        {createdProject && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#44ff44', color: '#000', borderRadius: '8px' }}>
            <strong>Proyecto creado exitosamente!</strong>
            <p style={{ margin: '0.5rem 0' }}>
              Short URL: <a href={createdProject.short_url} target="_blank" rel="noreferrer" style={{ color: '#0066cc' }}>
                {createdProject.short_url}
              </a>
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              Short Code: <code>{createdProject.short_code}</code>
            </p>
          </div>
        )}
      </div>

      {/* Projects List */}
      <div style={{ padding: '1.5rem', border: '1px solid #333', borderRadius: '8px' }}>
        <h2>Proyectos Existentes ({projects.length})</h2>
        {loading && projects.length === 0 ? (
          <p>Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p>No hay proyectos aún. Crea el primero!</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{project.app_name}</h3>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  <strong>Short Code:</strong> <code style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '4px' }}>{project.short_code}</code>
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  <strong>Short URL:</strong>{' '}
                  <a href={project.short_url} target="_blank" rel="noreferrer" style={{ color: '#646cff' }}>
                    {project.short_url}
                  </a>
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#888' }}>
                  Creado: {new Date(project.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
