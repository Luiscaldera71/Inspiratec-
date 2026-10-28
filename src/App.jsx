import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import WizardPage from './pages/WizardPage';
import EditorPage from './pages/EditorPage';
import ConfigPage from './pages/ConfigPage';
import { initAuth } from './services/authService';
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
import BienvenidaNarrativa from './components/BienvenidaNarrativa';
import ModalCalibracionDocente from './components/ModalCalibracionDocente';
import UserMenu from './components/UserMenu';
import FondoPixel from './components/FondoPixel';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Settings, 
  Lightbulb, 
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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('inspiratec_sidebar_collapsed');
      if (saved !== null) return saved === 'true';
    }
    return true; // Predeterminado colapsado para abrirse por encima del contenido como overlay
  });

  const [topUtilitiesCollapsed, setTopUtilitiesCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('inspiratec_top_utilities_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setSidebarCollapsed(true);
  };

  const toggleTopUtilities = () => {
    setTopUtilitiesCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_top_utilities_collapsed', String(next));
      }
      return next;
    });
  };

  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setSidebarCollapsed(true);
  }, [location.pathname]);


  const { userId, userProfile, apiKey, planesCount, setPlanesCount, clearWizardFormOnly } = useAppStore();

  useEffect(() => {
    const targetUid = userId || auth.currentUser?.uid || 'anon';
    getMisPlanes(targetUid).then(planes => {
      setPlanesCount(planes.length);
    }).catch(e => console.error(e));
  }, [userId, setPlanesCount]);


  // Fondo ambiental unificado idéntico a Inicio para todo el recorrido
  const ambientBg = '/images/inicio-fondo.png';
  const isAdmin = userProfile?.rol === 'Admin' || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com');

  return (
    <FondoPixel dim={0} className="app-background">
      <div className="app-shell-layout has-ambient-backdrop">
        {/* Fondo Ambiental Dinámico Institucional según Módulo */}
        <div 
          className="home-ambient-backdrop" 
          style={{ backgroundImage: `linear-gradient(180deg, rgba(20, 42, 38, 0.22) 0%, rgba(20, 42, 38, 0.08) 32%, rgba(20, 42, 38, 0.26) 100%), url('${ambientBg}')` }}
          aria-hidden="true" 
        />

        {/* Orbes Líquidos Dinámicos Globales (Liquid Glass Ambient System) */}
        <div className="liquid-ambient-container global-layout" aria-hidden="true">
          <div className="liquid-blob liquid-blob-1" />
          <div className="liquid-blob liquid-blob-2" />
          <div className="liquid-blob liquid-blob-3" />
          <div className="liquid-blob liquid-blob-4" />
        </div>

        {/* Experiencia Narrativa Inmersiva de Bienvenida (11 escenas) */}
        <BienvenidaNarrativa />

        {/* Modal de Onboarding y Calibración Curricular (Sin alterar la bienvenida) */}
        <ModalCalibracionDocente />

        {/* Indicador no invasivo de estado de conexión a internet */}
        <NetworkStatusBanner />

        {/* Barra superior compacta solo para vista móvil */}
        <header className="mobile-header-bar">
          <NavLink to="/home" className="mobile-brand-title">
            <Lightbulb size={20} color="var(--color-brand-active)" /> INSPIRATEC
          </NavLink>

          <UserMenu />
        </header>

            {/* Overlay para móvil y escritorio al expandir */}
            <div
              className={`sidebar-backdrop ${mobileMenuOpen ? 'open' : ''} ${!sidebarCollapsed ? 'desktop-expanded' : ''}`}
              onClick={() => {
                setMobileMenuOpen(false);
                setSidebarCollapsed(true);
              }}
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
                    <Lightbulb size={22} color="#FFFDF9" />
                  </div>
                  <div className="sidebar-brand-texts">
                    <span className="sidebar-brand-title">INSPIRATEC</span>
                    <span className="sidebar-brand-subtitle">Plataforma Curricular</span>
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
                <div className="sidebar-inst-badge">INSPIRATEC 2026</div>
                <p className="sidebar-inst-text">
                  Docencia con criterio, rigurosidad e innovación pedagógica.
                </p>
              </div>
            </aside>

        {/* Área de Contenido Principal */}
        <div className={`app-shell-main ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
          {/* Barra Superior Compacta de Utilidades (Esquina Superior Derecha en Escritorio) */}
          <header className="app-top-utilities-bar" aria-label="Utilidades y cuenta de usuario">
            <div className={`top-utilities-group ${topUtilitiesCollapsed ? 'is-collapsed' : ''}`}>
              {/* Botón para contraer / expandir el menú superior */}
              <button
                type="button"
                className="top-utility-collapse-trigger"
                onClick={toggleTopUtilities}
                aria-label={topUtilitiesCollapsed ? "Expandir menú de utilidades" : "Contraer menú de utilidades"}
                title={topUtilitiesCollapsed ? "Expandir menú de utilidades" : "Contraer menú de utilidades"}
              >
                {topUtilitiesCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>

              {!topUtilitiesCollapsed ? (
                <>
                  {/* 1. Configuración IA con indicador de estado */}
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

                  {/* Separador vertical */}
                  <div className="top-utilities-divider" />

                  {/* 3. Usuario y menú de cuenta */}
                  <div className="top-utility-user">
                    <UserMenu />
                  </div>
                </>
              ) : (
                /* Estado contraído: Iconos minimalistas rápidos */
                <button
                  type="button"
                  className="top-utilities-mini-pill"
                  onClick={toggleTopUtilities}
                  title="Expandir menú de cuenta e IA"
                  aria-label="Expandir menú de cuenta e IA"
                >
                  <span className={`ai-status-dot-mini ${apiKey && apiKey.length > 10 ? 'active' : 'pending'}`} />
                  <Settings size={14} style={{ color: '#142B25' }} />
                  <div className="top-user-avatar-mini">
                    {((userProfile?.rol || auth.currentUser?.displayName || 'D').charAt(0)).toUpperCase()}
                  </div>
                </button>
              )}
            </div>
          </header>

          <main className="app-main-content-scroll">
            <ErrorBoundary>
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
            </ErrorBoundary>
          </main>
        </div>

        {/* Barra Inferior Fija (Mobile Bottom Navigation) - Scroll Horizontal Continuo */}
        <nav className="mobile-bottom-nav" aria-label="Navegación principal en móviles">
          <NavLink 
            to="/home" 
            end
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Home size={19} />
            <span>Inicio</span>
          </NavLink>

          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={19} />
            <span>Planear</span>
          </NavLink>

          <NavLink 
            to="/mis-planes" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-bottom-icon-container">
              <FileText size={19} />
              {planesCount > 0 && <span className="mobile-bottom-counter-badge">{planesCount}</span>}
            </div>
            <span>Mis Planes</span>
          </NavLink>

          <NavLink 
            to="/adn-pedagogico" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Dna size={19} />
            <span>Mi ADN</span>
          </NavLink>

          <NavLink 
            to="/plantillas" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <BookOpen size={19} />
            <span>Plantillas</span>
          </NavLink>

          <NavLink 
            to="/biblioteca" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Library size={19} />
            <span>Biblioteca</span>
          </NavLink>

          <NavLink 
            to="/experiencias" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Compass size={19} />
            <span>Experiencias</span>
          </NavLink>

          <NavLink 
            to="/foro" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <MessageSquare size={19} />
            <span>Foro</span>
          </NavLink>

          <NavLink 
            to="/ayuda" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <HelpCircle size={19} />
            <span>Ayuda</span>
          </NavLink>

          <NavLink 
            to="/soporte" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <LifeBuoy size={19} />
            <span>Soporte</span>
          </NavLink>

          <NavLink 
            to="/config" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Settings size={19} />
            <span>Config IA</span>
          </NavLink>

          <NavLink 
            to="/acerca" 
            className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Info size={19} />
            <span>Acerca</span>
          </NavLink>

          {isAdmin && (
            <NavLink 
              to="/administracion" 
              className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Shield size={19} />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>
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
    <BrowserRouter>
      <Routes>
        {/* Pública: los estudiantes entran por QR sin cuenta */}
        <Route path="/s/:code" element={<StudentSessionPage />} />
        <Route path="*" element={!userId ? <AuthPage /> : <AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
