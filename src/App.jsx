import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import WizardPage from './pages/WizardPage';
import EditorPage from './pages/EditorPage';
import ConfigPage from './pages/ConfigPage';
import { initAuth, logoutUser } from './services/authService';
import { getMisPlanes } from './services/dbService';
import { useAppStore } from './store/useAppStore';
import { auth } from './firebase';

// Nuevas Páginas
import MisPlanesPage from './pages/MisPlanesPage';
import ExperienciasPage from './pages/ExperienciasPage';
import BibliotecaPage from './pages/BibliotecaPage';
import PlantillasPage from './pages/PlantillasPage';
import ForoPage from './pages/ForoPage';
import SoportePage from './pages/SoportePage';
import AyudaPage from './pages/AyudaPage';
import AdministracionPage from './pages/AdministracionPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import StudentSessionPage from './pages/StudentSessionPage';
import HomePage from './pages/HomePage';
import AdnPedagogicoPage from './pages/AdnPedagogicoPage';
import TourRapido from './components/TourRapido';
import InstallPrompt from './components/InstallPrompt';
import ModalCalibracionDocente from './components/ModalCalibracionDocente';
import CompletarPerfilModal from './components/CompletarPerfilModal';
import UserMenu from './components/UserMenu';
import FondoPixel from './components/FondoPixel';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Settings, 
 
  Menu, 
  X, 
  Home, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Shield, 
  Library, 
  Compass, 
  MessageSquare, 
  HelpCircle, 
  LifeBuoy, 
  Info,
  Dna,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardCheck,
  ExternalLink,
  Search,
  Plus,
  LayoutGrid,
  LogOut
} from 'lucide-react';
import { CONTROL_CLASE_URL } from './utils/externalTools';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Escritorio ancho: menú lateral persistente y expandido (como el diseño de referencia).
  // El docente puede contraerlo a un riel de iconos y la preferencia se recuerda.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('inspiratec_sidebar_collapsed_v2');
      if (saved !== null) return saved === 'true';
    }
    return typeof window !== 'undefined' ? window.innerWidth < 1100 : false;
  });

  const [moreOpen, setMoreOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_sidebar_collapsed_v2', String(next));
      }
      return next;
    });
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  // Atajo Ctrl/Cmd + K para enfocar el buscador
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/mis-planes?q=${encodeURIComponent(q)}` : '/mis-planes');
  };


  const { userId, userProfile, apiKey, planesCount, setPlanesCount, clearWizardFormOnly } = useAppStore();

  useEffect(() => {
    const targetUid = userId || auth.currentUser?.uid || 'anon';
    getMisPlanes(targetUid).then(planes => {
      setPlanesCount(planes.length);
    }).catch(e => console.error(e));
  }, [userId, setPlanesCount]);


  // Fondo ambiental unificado idéntico a Inicio para todo el recorrido
  const isAdmin = userProfile?.rol === 'Admin' || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com');

  return (
    <FondoPixel dim={0} className="app-background">
      <div className="app-shell-layout has-ambient-backdrop">
        {/* Fondo Ambiental Dinámico Institucional según Módulo */}
        <div 
          className="home-ambient-backdrop" 
          aria-hidden="true" 
        />

        {/* Orbes Líquidos Dinámicos Globales (Liquid Glass Ambient System) */}
        <div className="liquid-ambient-container global-layout" aria-hidden="true">
          <div className="liquid-blob liquid-blob-1" />
          <div className="liquid-blob liquid-blob-2" />
          <div className="liquid-blob liquid-blob-3" />
          <div className="liquid-blob liquid-blob-4" />
        </div>

        {/* Tutorial rápido de bienvenida (6 pasos, se puede omitir) */}
        <TourRapido />

        {/* Modal de Onboarding y Calibración Curricular (Sin alterar la bienvenida) */}
        <ModalCalibracionDocente />

        {/* Pide nombre, institución y nivel si faltan (p. ej. cuentas de Google) */}
        <CompletarPerfilModal />

        {/* Indicador no invasivo de estado de conexión a internet */}
        <NetworkStatusBanner />

        {/* Barra superior compacta solo para vista móvil */}
                <header className="mobile-header-bar">
          <NavLink to="/home" className="mobile-brand-title">
            <span className="m-brand-tile"><img src="/images/logo-mark.png" alt="" draggable={false} /></span>
            <span>InspiraTEC</span>
          </NavLink>

          <div className="m-header-actions">
            <NavLink to="/config" className="m-ai-chip" aria-label="Configuración de IA" title="Configuración de IA">
              <span className={`ai-status-dot-mini ${apiKey && apiKey.length > 10 ? 'active' : 'pending'}`} />
              <Sparkles size={17} />
            </NavLink>
            <UserMenu />
          </div>
        </header>

{/* Overlay para móvil y escritorio al expandir */}
            <div
              className={`sidebar-backdrop ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menú Lateral Verde Petróleo Translúcido */}
            <aside 
              className={`app-sidebar-lateral ${mobileMenuOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`} 
              aria-label="Menú principal INSPIRATEC"
            >
              {/* Encabezado con Marca */}
              <div className="sidebar-brand-header">
                <NavLink 
                  to="/home" 
                  className="sidebar-brand-link" 
                  onClick={handleNavClick}
                  title="Ir al Inicio de INSPIRATEC"
                >
                  <div className="sidebar-brand-icon">
                    <img src="/images/logo-mark.png" alt="" draggable={false} />
                  </div>
                  <div className="sidebar-brand-texts">
                    <span className="sidebar-brand-title">InspiraTEC</span>
                    <span className="sidebar-brand-subtitle">Docentes que transforman con tecnología</span>
                  </div>
                </NavLink>

                {/* Control compacto e intuitivo para contraer/expandir navegación lateral */}
                <button
                  type="button"
                  className="sidebar-collapse-toggle-btn"
                  onClick={toggleSidebar}
                  aria-label={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
                  title={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
                >
                  {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>

                <button
                  type="button"
                  className="sidebar-close-btn-mobile"
                  onClick={handleNavClick}
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Área de Navegación Vertical */}
              <nav className="sidebar-scrollable-nav">
                
                {/* 1. Navegación Principal (Planeación) */}
                <div className="sidebar-nav-group">
                  <div className="sidebar-group-label">Planeación</div>

                  <NavLink
                    to="/home"
                    id="nav-inicio"
                    end
                    title="Inicio"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Home size={18} />
                    <span>Inicio</span>
                  </NavLink>

                  <NavLink
                    to="/"
                    id="nav-planificador"
                    end
                    title="Planificador de Clases"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Sparkles size={18} />
                    <span>Planificador</span>
                  </NavLink>

                  <NavLink
                    to="/mis-planes"
                    id="nav-mis-planes"
                    title="Mis Planes de Clase"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <FileText size={18} />
                    <span>Mis Planes</span>
                    {planesCount > 0 && <span className="sidebar-counter-badge">{planesCount}</span>}
                  </NavLink>

                  <NavLink
                    to="/adn-pedagogico"
                    id="nav-adn-pedagogico"
                    title="Mi ADN Pedagógico & Estudio Transversal"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Dna size={18} />
                    <span>Mi ADN Pedagógico</span>
                  </NavLink>

                  <NavLink
                    to="/plantillas"
                    id="nav-plantillas"
                    title="Plantillas Curriculares"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <BookOpen size={18} />
                    <span>Plantillas</span>
                  </NavLink>

                  {isAdmin && (
                    <NavLink
                      to="/administracion"
                      id="nav-administracion"
                      title="Panel de Administración"
                      onClick={handleNavClick}
                      className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                    >
                      <Shield size={18} />
                      <span>Administración</span>
                    </NavLink>
                  )}
                </div>

                {/* Herramienta externa: Control de clase (el docente se registra allá) */}
                <div className="sidebar-nav-group">
                  <div className="sidebar-group-label">Herramientas</div>
                  <a
                    href={CONTROL_CLASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir Control de clase en una pestaña nueva"
                    onClick={handleNavClick}
                    className="sidebar-nav-item"
                  >
                    <ClipboardCheck size={18} />
                    <span>Control de clase</span>
                    <ExternalLink size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                  </a>
                </div>

                {/* 2. Sección Comunidad & Recursos */}
                <div className="sidebar-nav-group" id="nav-mas-recursos">
                  <div className="sidebar-group-label">Comunidad</div>

                  <NavLink
                    to="/biblioteca"
                    title="Biblioteca Comunitaria"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Library size={18} />
                    <span>Biblioteca</span>
                  </NavLink>

                  <NavLink
                    to="/experiencias"
                    title="Experiencias Sistematizadas"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Compass size={18} />
                    <span>Experiencias</span>
                  </NavLink>

                  <NavLink
                    to="/foro"
                    title="Foro Docente"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <MessageSquare size={18} />
                    <span>Foro Docente</span>
                  </NavLink>
                </div>

                {/* 3. Sección Soporte y Guías */}
                <div className="sidebar-nav-group">
                  <div className="sidebar-group-label">Soporte</div>

                  <NavLink
                    to="/ayuda"
                    title="Ayuda y Guías"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <HelpCircle size={18} />
                    <span>Ayuda y Guías</span>
                  </NavLink>

                  <NavLink
                    to="/soporte"
                    title="Soporte Técnico"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <LifeBuoy size={18} />
                    <span>Soporte Técnico</span>
                  </NavLink>

                  <NavLink
                    to="/acerca"
                    title="Acerca de INSPIRATEC"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Info size={18} />
                    <span>Acerca de</span>
                  </NavLink>
                </div>

                {/* Sección exclusiva para Drawer Móvil con accesos directos */}
                <div className="sidebar-nav-group mobile-only-nav-group">
                  <div className="sidebar-group-label">Herramientas</div>
                  <NavLink
                    to="/config"
                    title="Configuración IA"
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Settings size={18} />
                    <span>Configuración IA</span>
                  </NavLink>
                </div>
              </nav>

              {/* Pie Institucional del Menú Lateral */}
              <div className="sidebar-footer-institutional">
                <button
                  type="button"
                  className="sidebar-logout-btn"
                  onClick={() => logoutUser()}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </aside>

        {/* Área de Contenido Principal */}
        <div className={`app-shell-main ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
          {/* Barra superior: búsqueda global de planes, estado de IA y cuenta */}
          <header className="app-top-utilities-bar" aria-label="Búsqueda, estado de IA y cuenta de usuario">
            <form className="top-search-form" role="search" onSubmit={handleSearchSubmit}>
              <Search size={18} className="top-search-icon" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                className="top-search-input"
                placeholder="Buscar en mis planes de clase…"
                aria-label="Buscar en mis planes de clase"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <kbd className="top-search-kbd" aria-hidden="true">Ctrl + K</kbd>
            </form>

            <div className="top-utilities-group">
              <NavLink
                to="/config"
                id="nav-config"
                className={({ isActive }) => isActive ? 'top-utility-link top-utility-ai active' : 'top-utility-link top-utility-ai'}
                title={apiKey && apiKey.length > 10 ? "IA Gemini configurada y activa" : "Configurar API Key de Gemini"}
              >
                <Settings size={15} />
                <span>Configuración IA</span>
                <span className={`ai-status-indicator ${apiKey && apiKey.length > 10 ? 'active' : 'pending'}`}>
                  <span className="ai-status-dot" />
                  <span className="ai-status-label">{apiKey && apiKey.length > 10 ? 'Lista' : 'Configurar'}</span>
                </span>
              </NavLink>

              <div className="top-utilities-divider" />

              <div className="top-utility-user">
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="app-main-content-scroll">
            <ErrorBoundary>
              <div key={location.pathname} className="route-transition">
              <Routes>
                <Route path="/" element={<WizardPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/config" element={<ConfigPage />} />

                <Route path="/mis-planes" element={<MisPlanesPage />} />
                <Route path="/adn-pedagogico" element={<AdnPedagogicoPage />} />
                <Route path="/experiencias" element={<ExperienciasPage />} />
                <Route path="/biblioteca" element={<BibliotecaPage />} />
                <Route path="/plantillas" element={<PlantillasPage />} />
                <Route path="/foro" element={<ForoPage />} />
                <Route path="/soporte" element={<SoportePage />} />
                <Route path="/acerca" element={<AboutPage />} />
                <Route path="/ayuda" element={<AyudaPage />} />
                <Route path="/administracion" element={<AdministracionPage />} />
              </Routes>
              </div>
            </ErrorBoundary>
          </main>
        </div>

        {/* Barra inferior estilo app (móvil): 4 pestañas + botón central de crear */}
        <nav className="m-tabbar" aria-label="Navegación principal en móviles">
          <NavLink to="/home" end className={({ isActive }) => `m-tab ${isActive ? 'active' : ''}`}>
            <span className="m-tab-icon"><Home size={22} /></span>
            <span className="m-tab-label">Inicio</span>
          </NavLink>

          <NavLink to="/mis-planes" className={({ isActive }) => `m-tab ${isActive ? 'active' : ''}`}>
            <span className="m-tab-icon">
              <FileText size={22} />
              {planesCount > 0 && <span className="m-tab-badge">{planesCount}</span>}
            </span>
            <span className="m-tab-label">Mis planes</span>
          </NavLink>

          <NavLink to="/" end className="m-tab m-tab-fab" aria-label="Crear plan de clase">
            <span className="m-fab"><Plus size={28} strokeWidth={2.6} /></span>
            <span className="m-tab-label">Crear</span>
          </NavLink>

          <NavLink to="/plantillas" className={({ isActive }) => `m-tab ${isActive ? 'active' : ''}`}>
            <span className="m-tab-icon"><BookOpen size={22} /></span>
            <span className="m-tab-label">Plantillas</span>
          </NavLink>

          <button
            type="button"
            className={`m-tab ${moreOpen ? 'active' : ''}`}
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
          >
            <span className="m-tab-icon"><LayoutGrid size={22} /></span>
            <span className="m-tab-label">Más</span>
          </button>
        </nav>

        {/* Panel "Más": el resto de funciones, agrupadas */}
        <div className={`m-sheet-backdrop ${moreOpen ? 'open' : ''}`} onClick={() => setMoreOpen(false)} aria-hidden="true" />
        <div className={`m-sheet ${moreOpen ? 'open' : ''}`} role="dialog" aria-label="Más opciones" aria-hidden={!moreOpen}>
          <span className="m-sheet-handle" aria-hidden="true" />
          <div className="m-sheet-head">
            <strong>Todas las funciones</strong>
            <button type="button" className="m-sheet-close" onClick={() => setMoreOpen(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>

          <div className="m-sheet-group">Planeación</div>
          <div className="m-sheet-grid">
            <NavLink to="/adn-pedagogico" className="m-sheet-item"><span className="tone-icon tone-violet"><Dna size={20} /></span><span>Mi ADN</span></NavLink>
            <a href={CONTROL_CLASE_URL} target="_blank" rel="noopener noreferrer" className="m-sheet-item"><span className="tone-icon tone-teal"><ClipboardCheck size={20} /></span><span>Control de clase</span></a>
            <NavLink to="/config" className="m-sheet-item"><span className="tone-icon tone-blue"><Settings size={20} /></span><span>Configuración IA</span></NavLink>
            {isAdmin && (
              <NavLink to="/administracion" className="m-sheet-item"><span className="tone-icon tone-orange"><Shield size={20} /></span><span>Administración</span></NavLink>
            )}
          </div>

          <div className="m-sheet-group">Comunidad</div>
          <div className="m-sheet-grid">
            <NavLink to="/biblioteca" className="m-sheet-item"><span className="tone-icon tone-pink"><Library size={20} /></span><span>Biblioteca</span></NavLink>
            <NavLink to="/experiencias" className="m-sheet-item"><span className="tone-icon tone-indigo"><Compass size={20} /></span><span>Experiencias</span></NavLink>
            <NavLink to="/foro" className="m-sheet-item"><span className="tone-icon tone-green"><MessageSquare size={20} /></span><span>Foro docente</span></NavLink>
          </div>

          <div className="m-sheet-group">Soporte</div>
          <div className="m-sheet-grid">
            <NavLink to="/ayuda" className="m-sheet-item"><span className="tone-icon tone-orange"><HelpCircle size={20} /></span><span>Ayuda y guías</span></NavLink>
            <NavLink to="/soporte" className="m-sheet-item"><span className="tone-icon tone-teal"><LifeBuoy size={20} /></span><span>Soporte técnico</span></NavLink>
            <NavLink to="/acerca" className="m-sheet-item"><span className="tone-icon tone-violet"><Info size={20} /></span><span>Acerca de</span></NavLink>
          </div>
        </div>
      </div>
    </FondoPixel>
  );
}

function App() {
  const { userId } = useAppStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
        {/* Pública: los estudiantes entran por QR sin cuenta */}
        <Route path="/s/:code" element={<StudentSessionPage />} />
        <Route path="*" element={!userId ? <AuthPage /> : <AppContent />} />
      </Routes>
      </BrowserRouter>
      {/* Invita a instalar la app (PWA) cuando se abre desde el navegador */}
      <InstallPrompt />
    </>
  );
}

export default App;
