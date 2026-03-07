export default function QuantumAppRouter({ username, goldenKey, onLogout }) {
  function Layout({ children }) {
    const location = useLocation();
    const isLogin = location.pathname === '/';
    return (
      <>
        {!isLogin && <Nav3D />}
        <FloatingShapes zIndex={0} />
        <div style={isLogin ? { minHeight: '100vh', position: 'relative', zIndex: 1 } : { marginLeft: 120, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </>
    );
  }
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/vault" element={<VaultPage username={username} goldenKey={goldenKey} onLogout={onLogout} />} />
          <Route path="/download-share" element={<DownloadShare />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
