export default function DownloadShare() {
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [localShareData, setLocalShareData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regComplete = params.get('reg_complete');
    if (!regComplete) {
      console.log('[DownloadShare.jsx] Missing reg_complete in URL params.');
      setTimeout(() => {
        setError('Missing registration completion token.');
      }, 0);
      return;
    } else {
      console.log('[DownloadShare.jsx] reg_complete found:', regComplete);
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/register/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reg_id: regComplete })
    })
      .then(async res => {
        const contentType = res.headers.get('Content-Type');
        let raw = '';
        let data = null;
        try {
          raw = await res.text();
          if (raw && contentType && contentType.includes('application/json')) {
            data = JSON.parse(raw);
          }
        } catch {
          data = null;
          console.log('[DownloadShare.jsx] Exception parsing backend response:', raw);
        }
        return data;
      })
      .then(data => {
        if (data && data.status === 'success' && data.local_share) {
          setLocalShareData(data.local_share);
          console.log('[DownloadShare.jsx] Successfully received local_share.');
        } else {
          setError((data && data.message) || 'Failed to retrieve vault share.');
          console.log('[DownloadShare.jsx] Failed to retrieve vault share:', data);
        }
      })
      .catch(() => {
        setError('Network error while fetching vault share.');
        console.log('[DownloadShare.jsx] Network error while fetching vault share.');
      });
  }, [location]);

  const handleDownload = () => {
    if (!localShareData) return;
    setDownloading(true);
    const blob = new Blob([localShareData], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'local_share.enc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloading(false);
    setDownloaded(true);
    // Immediately navigate to vault after download
    navigate('/vault');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 520, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Vault Share Download</h2>
        <p style={{ fontSize: 18, marginBottom: 18, color: '#FFD66B' }}>
          <b>Why download this file?</b><br />
          <span style={{ color: '#fff', fontWeight: 400 }}>
            <br />
            <b>local_share.enc</b> is a critical part of your vault security. It is unique to your account and required to recover your vault or reset your password.<br /><br />
            <b>Keep this file safe!</b> Without it, you may lose access to your vault forever. Store it in a secure location and do not share it with anyone.<br /><br />
            You will need this file if you ever want to restore your account or access your encrypted data from a new device.
          </span>
        </p>
        {error && <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>}
        {!error && !downloaded && localShareData && (
          <button
            onClick={handleDownload}
            style={{
              background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 20, border: 'none', borderRadius: 12, padding: '14px 36px', marginTop: 18, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s'
            }}
            disabled={downloading}
          >
            {downloading ? 'Preparing Download...' : 'Download local_share.enc'}
          </button>
        )}
        {downloaded && !error && (
          <p style={{ color: '#FFD66B', fontWeight: 600, marginTop: 18 }}>Download started! Redirecting to your vault...</p>
        )}
      </div>
    </div>
  );
}
