import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { getAllUsers, getGlobalStats, getTickets, respondTicket } from '../services/dbService';
import { decryptSensitiveField, maskPhoneNumber } from '../utils/security';
import PageLoadingState from '../components/PageLoadingState';
import { getInstitutionalDnaAnalysis } from '../services/pedagogicalDnaService';
import { 
  ShieldCheck,
  Dna, 
  Lock, 
  Unlock, 
  Users, 
  BookOpen, 
  Sparkles, 
  Award, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  X,
  Send,
  MessageSquare,
  ShieldAlert,
  Search,
  CheckCircle2,
  Compass,
  Star,
  Layers,
  Check,
  Lightbulb,
  ExternalLink,
  Target,
  RotateCw,
  Clock,
  Sliders,
  Eye
} from 'lucide-react';

export default function AdministracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPlanes: 0, totalExperiencias: 0, estudiantesImpactados: 0 });
  const [tickets, setTickets] = useState([]);
  const [adnInstitucional, setAdnInstitucional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Analiticas');
  const [replyText, setReplyText] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [revealedPhones, setRevealedPhones] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNivel, setFilterNivel] = useState('Todos');

  // Estados reactivos y de sincronización con Backend para ADN Institucional
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [searchDnaTerm, setSearchDnaTerm] = useState('');
  const [filterDnaLevel, setFilterDnaLevel] = useState('Todos');
  const [selectedDocenteDna, setSelectedDocenteDna] = useState(null);

  useEffect(() => {
    if (!selectedUser && !selectedDocenteDna) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedUser(null);
        setSelectedDocenteDna(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = orig;
    };
  }, [selectedUser, selectedDocenteDna]);

  const syncWithBackend = async () => {
    try {
      const dbUsers = await getAllUsers();
      const dbStats = await getGlobalStats();
      const dbTickets = await getTickets();
      
      const usersWithStats = dbUsers.map(u => ({
        ...u,
        planesCount: dbStats.planesPorUsuario?.[u.id] || 0
      }));

      setUsuarios(usersWithStats);
      setStats(dbStats);
      setTickets(dbTickets);

      try {
        const dnaData = await getInstitutionalDnaAnalysis(usersWithStats, dbStats.allPlanes || []);
        setAdnInstitucional(dnaData);
      } catch (err) {
        console.error("Error calculando ADN Institucional:", err);
      }

      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      console.error("Error sincronizando con backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncWithBackend();

    const handleCalibracionUpdated = () => {
      syncWithBackend();
    };
    window.addEventListener('docente-calibracion-updated', handleCalibracionUpdated);
    return () => window.removeEventListener('docente-calibracion-updated', handleCalibracionUpdated);
  }, []);

  const handleRespond = async (ticketId) => {
    if (replyText[ticketId]?.trim()) {
      await respondTicket(ticketId, replyText[ticketId]);
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, estado: 'Resuelto', respuestaAdmin: replyText[ticketId] } : t));
      alert("Respuesta enviada al docente.");
    }
  };

  const togglePhoneReveal = (userId) => {
    setRevealedPhones(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (loading) {
    return (
      <div className="mgmt-container">
        <PageLoadingState 
          icon={ShieldCheck}
          badge="Administración Institucional"
          title="Cargando panel de administración y analíticas..."
          subtitle="Sincronizando métricas globales, usuarios docentes y tickets de soporte en tiempo real."
          fullPage
        />
      </div>
    );
  }

  // Cálculos estadísticos y manejo preciso de porcentajes flotantes
  const totalDocentes = Math.max(usuarios.length, 1);
  const primariaCount = usuarios.filter(u => u.nivel === 'Primaria').length;
  const secundariaCount = usuarios.filter(u => u.nivel === 'Secundaria').length;
  const mediaCount = usuarios.filter(u => u.nivel === 'Media').length;
  const otrosCount = Math.max(0, usuarios.length - (primariaCount + secundariaCount + mediaCount));

  const pctPrimaria = Number((primariaCount / totalDocentes) * 100);
  const pctSecundaria = Number((secundariaCount / totalDocentes) * 100);
  const pctMedia = Number((mediaCount / totalDocentes) * 100);
  const pctOtros = Number((otrosCount / totalDocentes) * 100);

  const promedioPlanesPorDocente = Number(stats.totalPlanes / totalDocentes).toFixed(1);
  const pendientesCount = tickets.filter(t => t.estado === 'Pendiente').length;
  const resueltosCount = tickets.filter(t => t.estado === 'Resuelto').length;
  const totalTickets = Math.max(tickets.length, 1);
  const tasaResolucion = tickets.length > 0 ? Math.round((resueltosCount / totalTickets) * 100) : 100;

  // Filtrado de usuarios
  const filteredUsers = usuarios.filter(u => {
    const matchSearch = (u.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.institucion || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchNivel = filterNivel === 'Todos' || u.nivel === filterNivel;
    return matchSearch && matchNivel;
  });

  // Cálculo SVG Donut Chart
  // Circunferencia = 2 * PI * r = 2 * 3.14159 * 42 ~= 263.89
  const circ = 263.89;
  const strokePrimaria = (pctPrimaria / 100) * circ;
  const strokeSecundaria = (pctSecundaria / 100) * circ;
  const strokeMedia = (pctMedia / 100) * circ;
  const strokeOtros = (pctOtros / 100) * circ;

  const offsetPrimaria = 0;
  const offsetSecundaria = -strokePrimaria;
  const offsetMedia = -(strokePrimaria + strokeSecundaria);
  const offsetOtros = -(strokePrimaria + strokeSecundaria + strokeMedia);

  return (
    <div className="mgmt-container" style={{ overflowX: 'hidden' }}>
      
      {/* 1. Cabecera Institucional Translúcida (Mismo desenfoque y panel de cristal de Inicio) */}
      <header 
        className="mgmt-header" 
        style={{ 
          width: '100%', 
          boxSizing: 'border-box',
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '18px',
          padding: '22px 28px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(16, 36, 32, 0.08)'
        }}
      >
        <div className="mgmt-header-info">
          <div className="mgmt-header-icon" style={{ backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#183630' }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="editorial-badge" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={13} color="#2B524A" />
              <span>Gobernanza y Supervisión Curricular</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '34px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 12px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Panel de Administración y Control
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '15.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.65', fontWeight: 500 }}>
              Métricas de impacto pedagógico en tiempo real, trazabilidad de datos docentes protegidos bajo Ley 1581 de 2012 y soporte activo.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <Users size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{stats.totalUsers} Docentes</span>
          </div>
          <div className="mgmt-stat-pill">
            <BookOpen size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{stats.totalPlanes} Planes</span>
          </div>
          <div className="mgmt-stat-pill">
            <Activity size={14} style={{ color: '#16A34A' }} />
            <span>{tasaResolucion}% Soporte</span>
          </div>
        </div>
      </header>

      {/* 2. Selector de Pestañas con Píldoras de Cristal (Mismo desenfoque de Inicio) */}
      <div 
        className="mgmt-filter-bar" 
        style={{ 
          marginBottom: '26px', 
          padding: '12px 18px', 
          width: '100%', 
          boxSizing: 'border-box',
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '18px',
          boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('Analiticas')}
            className={`btn-outline ${activeTab === 'Analiticas' ? 'active' : ''}`}
            style={{ 
              padding: '9px 20px', 
              fontSize: '14px', 
              borderRadius: '12px',
              backgroundColor: activeTab === 'Analiticas' ? '#142B25' : 'rgba(255, 255, 255, 0.92)',
              color: activeTab === 'Analiticas' ? '#FFFFFF' : '#142B25',
              borderColor: activeTab === 'Analiticas' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: activeTab === 'Analiticas' ? 700 : 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
            }}
          >
            <BarChart3 size={16} /> Analíticas y Métricas Gráficas
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('Directorio')}
            className={`btn-outline ${activeTab === 'Directorio' ? 'active' : ''}`}
            style={{ 
              padding: '9px 20px', 
              fontSize: '14px', 
              borderRadius: '12px',
              backgroundColor: activeTab === 'Directorio' ? '#142B25' : 'rgba(255, 255, 255, 0.92)',
              color: activeTab === 'Directorio' ? '#FFFFFF' : '#142B25',
              borderColor: activeTab === 'Directorio' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: activeTab === 'Directorio' ? 700 : 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
            }}
          >
            <Users size={16} /> Directorio de Docentes ({usuarios.length})
          </button>

          <button 
            type="button"
            id="tab-adn-institucional"
            onClick={() => setActiveTab('AdnInstitucional')}
            className={`btn-outline ${activeTab === 'AdnInstitucional' ? 'active' : ''}`}
            style={{ 
              padding: '9px 20px', 
              fontSize: '14px', 
              borderRadius: '12px',
              backgroundColor: activeTab === 'AdnInstitucional' ? '#142B25' : 'rgba(255, 255, 255, 0.92)',
              color: activeTab === 'AdnInstitucional' ? '#FFFFFF' : '#142B25',
              borderColor: activeTab === 'AdnInstitucional' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: activeTab === 'AdnInstitucional' ? 700 : 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)',
              cursor: 'pointer'
            }}
            title="Diagnóstico y análisis colectivo del ADN Pedagógico e Identidad Curricular Institucional"
          >
            <Dna size={16} style={{ color: activeTab === 'AdnInstitucional' ? '#4ADE80' : '#059669' }} /> Identidad & ADN Pedagógico
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('Tickets')}
            className={`btn-outline ${activeTab === 'Tickets' ? 'active' : ''}`}
            style={{ 
              padding: '9px 20px', 
              fontSize: '14px', 
              borderRadius: '12px',
              backgroundColor: activeTab === 'Tickets' ? '#142B25' : 'rgba(255, 255, 255, 0.92)',
              color: activeTab === 'Tickets' ? '#FFFFFF' : '#142B25',
              borderColor: activeTab === 'Tickets' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: activeTab === 'Tickets' ? 700 : 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
            }}
          >
            <MessageSquare size={16} /> Tickets de Soporte
            {pendientesCount > 0 && (
              <span style={{ backgroundColor: '#DC2626', color: '#FFFFFF', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                {pendientesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          PESTAÑA 1: ANALÍTICAS Y GRÁFICOS INTERACTIVOS
          ======================================================== */}
      {activeTab === 'Analiticas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Tarjetas KPI con mini-gráficos visuales de tendencia */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', width: '100%' }}>
            
            {/* KPI 1: Docentes */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '22px 24px', 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 254, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Docentes Activos
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <Users size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.totalUsers}
              </p>
              {/* Mini Sparkline SVG */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <TrendingUp size={14} /> +100% Cuentas
                </span>
              </div>
            </div>

            {/* KPI 2: Planes */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '22px 24px', 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 254, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Planes de Clase
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <BookOpen size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.totalPlanes}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 500 }}>
                  Promedio: <strong>{promedioPlanesPorDocente}</strong>/docente
                </span>
              </div>
            </div>

            {/* KPI 3: Experiencias */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '22px 24px', 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 254, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Experiencias Abiertas
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <Sparkles size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.totalExperiencias}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 500 }}>
                  Comunidad activa
                </span>
              </div>
            </div>

            {/* KPI 4: Estudiantes Impactados */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '22px 24px', 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 254, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Impacto Escolar
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(22, 163, 74, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                  <Award size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#166534', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.estudiantesImpactados.toLocaleString()}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                  Estudiantes declarados en planes
                </span>
              </div>
            </div>

          </div>

          {/* ==================== SECCIÓN DE GRÁFICOS VISUALES ==================== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>
            
            {/* GRÁFICO 1: GRÁFICO DONUT SVG DE DISTRIBUCIÓN POR NIVEL */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '26px 28px',
                backgroundColor: 'rgba(255, 254, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '22px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(49, 91, 84, 0.14)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16.5px', color: '#142B25', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={18} color="#183630" /> Gráfico de Distribución por Nivel
                </h2>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 600 }}>{totalDocentes} Docentes</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
                {/* Visualizador Donut SVG */}
                <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Fondo base */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(49, 91, 84, 0.12)" strokeWidth="12" />
                    {/* Arco Primaria */}
                    {pctPrimaria > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#477A72" strokeWidth="12"
                        strokeDasharray={`${strokePrimaria} ${circ}`}
                        strokeDashoffset={offsetPrimaria}
                      />
                    )}
                    {/* Arco Secundaria */}
                    {pctSecundaria > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#315B54" strokeWidth="12"
                        strokeDasharray={`${strokeSecundaria} ${circ}`}
                        strokeDashoffset={offsetSecundaria}
                      />
                    )}
                    {/* Arco Media */}
                    {pctMedia > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#183630" strokeWidth="12"
                        strokeDasharray={`${strokeMedia} ${circ}`}
                        strokeDashoffset={offsetMedia}
                      />
                    )}
                    {/* Arco Otros */}
                    {pctOtros > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#A7C4BC" strokeWidth="12"
                        strokeDasharray={`${strokeOtros} ${circ}`}
                        strokeDashoffset={offsetOtros}
                      />
                    )}
                  </svg>
                  {/* Centro del Donut */}
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#142B25', display: 'block', lineHeight: 1 }}>{totalDocentes}</span>
                    <span style={{ fontSize: '10.5px', color: '#4A635B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</span>
                  </div>
                </div>

                {/* Leyenda y barras complementarias */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '170px', flex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#142B25', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#477A72' }} />
                        Primaria ({primariaCount})
                      </span>
                      <strong style={{ color: '#183630' }}>{pctPrimaria.toFixed(1)}%</strong>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pctPrimaria}%`, backgroundColor: '#477A72' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#142B25', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#315B54' }} />
                        Secundaria ({secundariaCount})
                      </span>
                      <strong style={{ color: '#183630' }}>{pctSecundaria.toFixed(1)}%</strong>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pctSecundaria}%`, backgroundColor: '#315B54' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#142B25', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#183630' }} />
                        Media ({mediaCount})
                      </span>
                      <strong style={{ color: '#183630' }}>{pctMedia.toFixed(1)}%</strong>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pctMedia}%`, backgroundColor: '#183630' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICO 2: MEDIDORES DE ÁREAS CURRICULARES */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '26px 28px',
                backgroundColor: 'rgba(255, 254, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '22px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(49, 91, 84, 0.14)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16.5px', color: '#142B25', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#183630" /> Producción Curricular por Área
                </h2>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 600 }}>Enfoque STEAM</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Tecnología */}
                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.72)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#142B25', display: 'block' }}>Tecnología e Informática</strong>
                      <span style={{ fontSize: '11.5px', color: '#4A635B' }}>Algoritmos y pensamiento computacional</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(71, 122, 114, 0.18)', color: '#183630', fontSize: '11.5px', fontWeight: 700 }}>
                      42% del total
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '42%', backgroundColor: '#183630', borderRadius: '999px' }} />
                  </div>
                </div>

                {/* Matemáticas */}
                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.72)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#142B25', display: 'block' }}>Matemáticas</strong>
                      <span style={{ fontSize: '11.5px', color: '#4A635B' }}>Modelación y problemas reales</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(71, 122, 114, 0.18)', color: '#183630', fontSize: '11.5px', fontWeight: 700 }}>
                      34% del total
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '34%', backgroundColor: '#315B54', borderRadius: '999px' }} />
                  </div>
                </div>

                {/* Lenguaje e Idiomas */}
                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.72)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#142B25', display: 'block' }}>Lenguaje e Inglés</strong>
                      <span style={{ fontSize: '11.5px', color: '#4A635B' }}>Comprensión y expresión comunicativa</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(71, 122, 114, 0.18)', color: '#183630', fontSize: '11.5px', fontWeight: 700 }}>
                      24% del total
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '24%', backgroundColor: '#477A72', borderRadius: '999px' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* GRÁFICO 3: TASA DE RESOLUCIÓN DE SOPORTE */}
          <div 
            className="mgmt-card" 
            style={{ 
              padding: '24px 28px', 
              width: '100%', 
              boxSizing: 'border-box',
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '22px',
              boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16.5px', color: '#142B25', margin: '0 0 4px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#183630" /> Estado de Solicitudes y Atención a Docentes
                </h3>
                <p style={{ fontSize: '13px', color: '#3A544C', margin: 0 }}>
                  Eficiencia de soporte técnico institucional y resolución de dudas sobre el planificador.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#DCFCE7', color: '#166534', fontSize: '12px', fontWeight: 700 }}>
                  {resueltosCount} Resueltos
                </span>
                <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: pendientesCount > 0 ? '#FEF3C7' : '#E7EDE7', color: pendientesCount > 0 ? '#92400E' : '#315B54', fontSize: '12px', fontWeight: 700 }}>
                  {pendientesCount} Pendientes
                </span>
              </div>
            </div>

            <div style={{ height: '12px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.14)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ height: '100%', width: `${tasaResolucion}%`, backgroundColor: '#16A34A', transition: 'width 0.4s ease' }} title={`Resueltos: ${tasaResolucion}%`} />
              <div style={{ height: '100%', width: `${100 - tasaResolucion}%`, backgroundColor: '#F59E0B', transition: 'width 0.4s ease' }} title={`Pendientes: ${100 - tasaResolucion}%`} />
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          PESTAÑA 2: DIRECTORIO DE DOCENTES CON CONTENCIÓN ESTRICTA
          ======================================================== */}
      {activeTab === 'Directorio' && (
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          
          {/* Barra de Filtros y Búsqueda */}
          <div className="mgmt-filter-bar" style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
              <div className="mgmt-search-box" style={{ width: '100%', minWidth: 'auto' }}>
                <Search size={16} color="var(--primary-sage)" />
                <input 
                  type="text" 
                  placeholder="Buscar docente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mgmt-search-input"
                  aria-label="Buscar docente por nombre, email o colegio"
                />
              </div>
            </div>

            {/* Chips de filtro por nivel */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Todos', 'Primaria', 'Secundaria', 'Media'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFilterNivel(n)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    border: '1px solid rgba(49, 91, 84, 0.22)',
                    backgroundColor: filterNivel === n ? '#183630' : 'rgba(255, 255, 255, 0.72)',
                    color: filterNivel === n ? '#FFFFFF' : '#142B25',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 254, 250, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.96)',
                borderRadius: '999px',
                padding: '6px 16px',
                boxShadow: '0 4px 14px rgba(16, 36, 32, 0.08)'
              }}
            >
              <Users size={14} style={{ color: '#166534' }} />
              <span style={{ fontSize: '13px', color: '#142B25', fontWeight: 600 }}>
                Mostrando <strong style={{ color: '#166534', fontWeight: 700 }}>{filteredUsers.length}</strong> de <strong style={{ color: '#142B25', fontWeight: 700 }}>{usuarios.length}</strong> docentes registrados
              </span>
            </div>

            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center', 
                gap: '7px', 
                fontSize: '12px', 
                color: '#166534', 
                backgroundColor: 'rgba(220, 252, 231, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(187, 247, 208, 0.95)',
                padding: '6px 14px', 
                borderRadius: '999px', 
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(16, 36, 32, 0.06)'
              }}
            >
              <ShieldCheck size={14} /> 
              <span>Cifrado Habeas Data (Ley 1581 de 2012)</span>
            </div>
          </div>

          {/* Tabla Contenida con Scroll Horizontal Interno (Mismo desenfoque de cristal) */}
          <div 
            className="mgmt-card" 
            style={{ 
              padding: '0', 
              overflow: 'hidden', 
              width: '100%', 
              boxSizing: 'border-box', 
              marginBottom: '32px',
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '22px',
              boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
            }}
          >
            {/* VISTA ESCRITORIO / TABLET: Tabla Completa */}
            <div className="admin-table-desktop-view" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '640px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(71, 122, 114, 0.12)', borderBottom: '1px solid rgba(49, 91, 84, 0.18)' }}>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Docente</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Celular Cifrado</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Nivel / Rol</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Institución</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Planes</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: '#4B635B' }}>
                        No se encontraron docentes con los criterios de búsqueda seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const plainPhone = decryptSensitiveField(u.celular);
                      const isRevealed = Boolean(revealedPhones[u.id]);
                      const displayPhone = plainPhone ? (isRevealed ? plainPhone : maskPhoneNumber(plainPhone)) : 'No registrado';

                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(49, 91, 84, 0.10)', transition: 'background-color 0.15s ease' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#142B25' }}>{u.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#3A544C' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '12.5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#142B25' }}>{displayPhone}</span>
                              {plainPhone && (
                                <button
                                  type="button"
                                  onClick={() => togglePhoneReveal(u.id)}
                                  title={isRevealed ? "Ocultar teléfono" : "Descifrar teléfono para contacto"}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px', color: '#315B54', display: 'flex', alignItems: 'center' }}
                                >
                                  {isRevealed ? <Lock size={13} color="#183630" /> : <Unlock size={13} />}
                                </button>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ 
                              background: u.nivel === 'Primaria' ? 'rgba(71, 122, 114, 0.14)' : u.nivel === 'Secundaria' ? 'rgba(49, 91, 84, 0.18)' : 'rgba(24, 54, 48, 0.18)', 
                              color: '#183630', 
                              padding: '3px 10px', 
                              borderRadius: '999px', 
                              fontSize: '11.5px', 
                              fontWeight: 700 
                            }}>
                              {u.nivel || u.rol || 'Docente'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '13px', color: '#2B433B' }}>
                            {u.institucion || 'Institución Educativa'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontWeight: 700, color: '#183630', fontSize: '13.5px' }}>
                              {u.planesCount !== undefined ? u.planesCount : 0}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <button className="btn-outline" style={{ padding: '5px 12px', fontSize: '12px' }} onClick={() => setSelectedUser(u)}>
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* VISTA MÓVIL: Tarjetas de Perfil Resumen con Ficha Completa */}
            <div className="admin-cards-mobile-view" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredUsers.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#4B635B' }}>
                  No se encontraron docentes con los criterios de búsqueda seleccionados.
                </div>
              ) : (
                filteredUsers.map(u => {
                  const plainPhone = decryptSensitiveField(u.celular);
                  const isRevealed = Boolean(revealedPhones[u.id]);
                  const displayPhone = plainPhone ? (isRevealed ? plainPhone : maskPhoneNumber(plainPhone)) : 'No registrado';

                  return (
                    <div 
                      key={u.id}
                      className="admin-docente-mobile-card"
                      style={{
                        padding: '16px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid rgba(49, 91, 84, 0.16)',
                        boxShadow: '0 2px 8px rgba(16, 36, 32, 0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(71, 122, 114, 0.16)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#166534',
                            fontWeight: 700,
                            fontSize: '15px'
                          }}>
                            {(u.nombre || 'D').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#142B25' }}>{u.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#4A655D' }}>{u.email}</div>
                          </div>
                        </div>

                        <span style={{ 
                          background: u.nivel === 'Primaria' ? 'rgba(71, 122, 114, 0.14)' : u.nivel === 'Secundaria' ? 'rgba(49, 91, 84, 0.18)' : 'rgba(24, 54, 48, 0.18)', 
                          color: '#183630', 
                          padding: '3px 9px', 
                          borderRadius: '999px', 
                          fontSize: '11px', 
                          fontWeight: 700 
                        }}>
                          {u.nivel || u.rol || 'Docente'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', padding: '10px', backgroundColor: '#F8FAF9', borderRadius: '10px' }}>
                        <div>
                          <span style={{ color: '#576864', display: 'block', fontSize: '11px' }}>Institución:</span>
                          <strong style={{ color: '#142B25' }}>{u.institucion || 'Colegio'}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#576864', display: 'block', fontSize: '11px' }}>Planes Creados:</span>
                          <strong style={{ color: '#166534' }}>{u.planesCount || 0} planes</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <span style={{ fontFamily: 'monospace', color: '#142B25' }}>{displayPhone}</span>
                          {plainPhone && (
                            <button
                              type="button"
                              onClick={() => togglePhoneReveal(u.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#315B54' }}
                              aria-label={isRevealed ? "Ocultar teléfono" : "Descifrar teléfono"}
                            >
                              {isRevealed ? <Lock size={13} color="#183630" /> : <Unlock size={13} />}
                            </button>
                          )}
                        </div>

                        <button 
                          type="button"
                          className="btn-outline" 
                          style={{ padding: '6px 14px', fontSize: '12px', minHeight: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF' }}
                          onClick={() => setSelectedUser(u)}
                        >
                          <Eye size={13} />
                          <span>Ver Ficha Completa</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Modal Detalle de Usuario con Diseño de Cristal montado en body con createPortal */}
          {selectedUser && createPortal(
            <div 
              className="modal-glass-backdrop" 
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedUser(null); }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-detail-title"
            >
              <div 
                className="modal-glass-card" 
                style={{ 
                  maxWidth: '520px',
                  backgroundColor: 'rgba(255, 254, 250, 0.94)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.96)',
                  borderRadius: '24px',
                  boxShadow: '0 24px 60px rgba(16, 36, 32, 0.22)'
                }}
              >
                <div className="modal-glass-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(71, 122, 114, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1C3D36',
                      fontWeight: 700
                    }}>
                      {(selectedUser.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <h3 id="user-detail-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                      Detalle de Cuenta Docente
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className="modal-glass-close-btn"
                    aria-label="Cerrar detalle docente"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-glass-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#142B25' }}>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 254, 250, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.94)', boxShadow: '0 2px 8px rgba(20, 42, 38, 0.03)' }}>
                    <strong>Nombre:</strong> {selectedUser.nombre}
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 254, 250, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.94)', boxShadow: '0 2px 8px rgba(20, 42, 38, 0.03)' }}>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 254, 250, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.94)', boxShadow: '0 2px 8px rgba(20, 42, 38, 0.03)' }}>
                    <strong>Celular de Contacto:</strong>{' '}
                    <span style={{ fontFamily: 'monospace' }}>
                      {decryptSensitiveField(selectedUser.celular) || 'No registrado'}
                    </span>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 254, 250, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.94)', boxShadow: '0 2px 8px rgba(20, 42, 38, 0.03)' }}>
                    <strong>Rol:</strong> {selectedUser.rol || 'Docente'}
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 254, 250, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.94)', boxShadow: '0 2px 8px rgba(20, 42, 38, 0.03)' }}>
                    <strong>Institución:</strong> {selectedUser.institucion || 'N/A'}
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 254, 250, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.94)', boxShadow: '0 2px 8px rgba(20, 42, 38, 0.03)' }}>
                    <strong>Nivel Pedagógico:</strong> {selectedUser.nivel || 'N/A'}
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 254, 250, 0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.94)', boxShadow: '0 2px 8px rgba(20, 42, 38, 0.03)' }}>
                    <strong>Consentimiento Habeas Data:</strong> {selectedUser.termsAccepted ? 'Aceptado (Ley 1581 de 2012)' : 'Pre-existente'}
                  </div>
                  <div style={{ padding: '12px 14px', backgroundColor: 'rgba(71, 122, 114, 0.08)', borderRadius: '12px', border: '1px solid rgba(71, 122, 114, 0.2)' }}>
                    <strong>Planes Creados en Plataforma:</strong> <strong style={{ color: '#183630', fontSize: '15px' }}>{selectedUser.planesCount}</strong>
                  </div>
                </div>

                <div className="modal-glass-footer">
                  <button className="btn btn-primary" onClick={() => setSelectedUser(null)} style={{ padding: '8px 22px' }}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

        </div>
      )}

      {/* ========================================================
          PESTAÑA 3: ADN PEDAGÓGICO INSTITUCIONAL & HUELLA COLECTIVA
          ======================================================== */}
      {activeTab === 'AdnInstitucional' && (
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          
          {/* Banner Hero Institucional con Acceso al ADN Personal y Configuración de Estándar */}
          <div 
            className="mgmt-card"
            style={{
              padding: '26px 30px',
              marginBottom: '24px',
              backgroundColor: 'rgba(255, 254, 250, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.96)',
              borderRadius: '22px',
              boxShadow: '0 12px 36px rgba(16, 36, 32, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ maxWidth: '680px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <div className="editorial-badge" style={{ backgroundColor: 'rgba(22, 163, 74, 0.12)', color: '#166534', borderColor: 'rgba(22, 163, 74, 0.25)' }}>
                    <Dna size={14} style={{ color: '#16A34A' }} />
                    <span>Huella Curricular & Gobernanza Pedagógica</span>
                  </div>
                  <div className="editorial-badge" style={{ backgroundColor: 'rgba(71, 122, 114, 0.12)', color: '#183630', borderColor: 'rgba(71, 122, 114, 0.25)' }}>
                    <ShieldCheck size={14} style={{ color: '#10B981' }} />
                    <span>Análisis Colectivo ({usuarios.length} Docentes Registrados)</span>
                  </div>
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '23px', color: '#142B25', margin: '0 0 8px 0', fontWeight: 700 }}>
                  ADN Pedagógico Institucional & Estudio Transversal Colectivo
                </h2>
                <p style={{ fontSize: '14px', color: '#2F4840', margin: 0, lineHeight: '1.6' }}>
                  Diagnóstico en tiempo real sobre las metodologías didácticas activas, ejes transversales PRAE/STEAM, enfoques DUA y recursos con mayor efectividad en aula registrados por toda la comunidad docente.
                </p>
              </div>

              {/* Acceso al ADN Personal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Link 
                  to="/adn-pedagogico"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(20, 42, 38, 0.25)',
                    whiteSpace: 'nowrap'
                  }}
                  title="Abrir tu apartado individual de ADN Pedagógico"
                >
                  <Sparkles size={15} /> Ir a mi ADN Personal
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#576864', padding: '0 4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Datos al día ({lastSyncTime})
                  </span>
                  <span style={{ color: '#166534', fontWeight: 600 }}>● Firestore Activo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cuadrícula de 4 Métricas Clave de ADN */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '16px', 
              marginBottom: '26px' 
            }}
          >
            {/* KPI 1 */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '20px 22px', 
                backgroundColor: 'rgba(255, 254, 250, 0.90)', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)', 
                border: '1px solid rgba(255, 255, 255, 0.95)', 
                borderRadius: '18px', 
                boxShadow: '0 6px 20px rgba(16, 36, 32, 0.06)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#47635B', fontWeight: 600 }}>Claustro Docente</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <Users size={19} />
                </div>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: '#142B25', lineHeight: 1, marginBottom: '6px' }}>
                {adnInstitucional?.totalDocentesRegistrados || usuarios.length}
              </div>
              <div style={{ fontSize: '12px', color: '#2E4C43', fontWeight: 500 }}>
                {stats.totalPlanes || 0} secuencias didácticas articuladas
              </div>
            </div>

            {/* KPI 2 */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '20px 22px', 
                backgroundColor: 'rgba(255, 254, 250, 0.90)', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)', 
                border: '1px solid rgba(255, 255, 255, 0.95)', 
                borderRadius: '18px', 
                boxShadow: '0 6px 20px rgba(16, 36, 32, 0.06)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#47635B', fontWeight: 600 }}>Innovación Curricular</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                  <TrendingUp size={19} />
                </div>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: '#166534', lineHeight: 1, marginBottom: '6px' }}>
                {adnInstitucional?.promedioInnovacionGlobal !== null && adnInstitucional?.promedioInnovacionGlobal !== undefined
                  ? `${adnInstitucional.promedioInnovacionGlobal}%`
                  : '—'}
              </div>
              <div style={{ fontSize: '12px', color: '#2E4C43', fontWeight: 500 }}>
                {adnInstitucional?.promedioInnovacionGlobal !== null && adnInstitucional?.promedioInnovacionGlobal !== undefined
                  ? 'Promedio real del claustro activo'
                  : 'Sin planes con innovación aún'}
              </div>
            </div>

            {/* KPI 3 */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '20px 22px', 
                backgroundColor: 'rgba(255, 254, 250, 0.90)', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)', 
                border: '1px solid rgba(255, 255, 255, 0.95)', 
                borderRadius: '18px', 
                boxShadow: '0 6px 20px rgba(16, 36, 32, 0.06)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#47635B', fontWeight: 600 }}>Metodología Líder</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
                  <Compass size={19} />
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#142B25', lineHeight: 1.3, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={adnInstitucional?.metodologiaPredominante}>
                {adnInstitucional?.metodologiaPredominante || 'Pendiente por registrar'}
              </div>
              <div style={{ fontSize: '12px', color: '#2E4C43', fontWeight: 500 }}>
                Mayor recurrencia en el claustro
              </div>
            </div>

            {/* KPI 4 */}
            <div 
              className="mgmt-card" 
              style={{ 
                padding: '20px 22px', 
                backgroundColor: 'rgba(255, 254, 250, 0.90)', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)', 
                border: '1px solid rgba(255, 255, 255, 0.95)', 
                borderRadius: '18px', 
                boxShadow: '0 6px 20px rgba(16, 36, 32, 0.06)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#47635B', fontWeight: 600 }}>Recurso Didáctico #1</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(234, 179, 8, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                  <Star size={19} />
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#142B25', lineHeight: 1.3, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={adnInstitucional?.recursoMasPopular}>
                {adnInstitucional?.recursoMasPopular || 'Sin recursos anexados aún'}
              </div>
              <div style={{ fontSize: '12px', color: '#2E4C43', fontWeight: 500 }}>
                Mayor uso en secuencias creadas
              </div>
            </div>
          </div>

          {/* Panel de Contraste Curricular: Metodología Declarada vs. Aplicada */}
          <div 
            className="mgmt-card"
            style={{
              padding: '24px 28px',
              marginBottom: '26px',
              backgroundColor: 'rgba(255, 254, 250, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.96)',
              borderRadius: '22px',
              boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#142B25', margin: 0 }}>
                    Diagnóstico Curricular Comparativo: Declarada vs. Aplicada en Aula
                  </h3>
                  <p style={{ fontSize: '13px', color: '#4A655D', margin: 0 }}>
                    Contraste entre lo que los docentes registraron como metodología institucional vs. lo que efectivamente planifican.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#166534', backgroundColor: 'rgba(22, 163, 74, 0.12)', padding: '5px 14px', borderRadius: '999px', border: '1px solid rgba(22, 163, 74, 0.25)' }}>
                  🎯 Coherencia Curricular: {adnInstitucional?.diagnosticoComparativo?.indiceAlineacionCurricular !== null && adnInstitucional?.diagnosticoComparativo?.indiceAlineacionCurricular !== undefined
                    ? `${adnInstitucional.diagnosticoComparativo.indiceAlineacionCurricular}%`
                    : 'En diagnóstico'}
                </span>
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(71, 122, 114, 0.08)', border: '1px solid rgba(71, 122, 114, 0.18)', marginBottom: '18px', fontSize: '13px', color: '#183630', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Sparkles size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Diagnóstico Pedagógico Institucional:</strong> {adnInstitucional?.diagnosticoComparativo?.observacionAlineacion || 'Cargando diagnóstico institucional en base a registros de docentes y secuencias de aula...'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Columna 1: Declaradas en Registro */}
              <div style={{ padding: '16px 18px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#142B25' }}>
                    📋 Declaradas en Registro Docente
                  </strong>
                  <span style={{ fontSize: '11px', color: '#576864' }}>Perfil Institucional</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(adnInstitucional?.diagnosticoComparativo?.rankingDeclaradas || []).length > 0 ? (
                    (adnInstitucional?.diagnosticoComparativo?.rankingDeclaradas || []).slice(0, 4).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                          <span style={{ fontWeight: 600, color: '#1C3831' }}>{item.name}</span>
                          <span style={{ fontWeight: 700, color: '#2563EB' }}>{item.pct}% ({item.count})</span>
                        </div>
                        <div style={{ width: '100%', height: '7px', backgroundColor: 'rgba(37, 99, 235, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(10, item.pct)}%`, height: '100%', backgroundColor: '#2563EB', borderRadius: '999px' }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12.5px', color: '#64748B', fontStyle: 'italic', padding: '8px 0' }}>
                      Aún no hay metodologías registradas por los docentes.
                    </div>
                  )}
                </div>
              </div>

              {/* Columna 2: Aplicadas en Secuencias de Clase */}
              <div style={{ padding: '16px 18px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#142B25' }}>
                    💡 Aplicadas en Planes de Clase
                  </strong>
                  <span style={{ fontSize: '11px', color: '#576864' }}>Planes en Firestore</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(adnInstitucional?.diagnosticoComparativo?.rankingAplicadas || []).length > 0 ? (
                    (adnInstitucional?.diagnosticoComparativo?.rankingAplicadas || []).slice(0, 4).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                          <span style={{ fontWeight: 600, color: '#1C3831' }}>{item.name}</span>
                          <span style={{ fontWeight: 700, color: '#166534' }}>{item.pct}% ({item.count})</span>
                        </div>
                        <div style={{ width: '100%', height: '7px', backgroundColor: 'rgba(22, 163, 74, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(10, item.pct)}%`, height: '100%', backgroundColor: '#16A34A', borderRadius: '999px' }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12.5px', color: '#64748B', fontStyle: 'italic', padding: '8px 0' }}>
                      Aún no hay secuencias didácticas registradas en Firestore.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grilla: 1. Metodologías vs 2. Transversalidad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px', marginBottom: '26px' }}>
            
            {/* Metodologías */}
            <div 
              className="mgmt-card"
              style={{
                padding: '24px 26px',
                backgroundColor: 'rgba(255, 254, 250, 0.90)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.07)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: 'rgba(71, 122, 114, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <Layers size={18} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#142B25', margin: 0 }}>
                  Metodologías Pedagógicas Adoptadas
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#4A655D', margin: '0 0 18px 0', lineHeight: 1.5 }}>
                Distribución porcentual de los modelos didácticos activos aplicados en las secuencias curriculares.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(adnInstitucional?.metodologiasRanking || []).slice(0, 5).map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: '#1C3831' }}>{m.name}</span>
                      <span style={{ fontWeight: 700, color: '#166534', backgroundColor: 'rgba(22, 163, 74, 0.10)', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px' }}>
                        {m.pct}% ({m.count} planes)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${Math.min(100, Math.max(10, m.pct))}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #183630 0%, #315B54 60%, #10B981 100%)', 
                          borderRadius: '999px',
                          transition: 'width 0.5s ease'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transversalidad */}
            <div 
              className="mgmt-card"
              style={{
                padding: '24px 26px',
                backgroundColor: 'rgba(255, 254, 250, 0.90)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(16, 36, 32, 0.07)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: 'rgba(16, 185, 129, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                  <Target size={18} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#142B25', margin: 0 }}>
                  Matriz de Transversalidad & Proyectos Institucionales
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#4A655D', margin: '0 0 18px 0', lineHeight: 1.5 }}>
                Integración de los proyectos pedagógicos obligatorios (PRAE, Ciudadanía, STEAM y DUA).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(adnInstitucional?.ejesRanking || []).slice(0, 5).map((eje, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: '#1C3831' }}>{eje.name}</span>
                      <span style={{ fontWeight: 700, color: '#183630', backgroundColor: 'rgba(71, 122, 114, 0.12)', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px' }}>
                        {eje.pct}% adopción
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${Math.min(100, Math.max(12, eje.pct))}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #10B981 0%, #315B54 100%)', 
                          borderRadius: '999px',
                          transition: 'width 0.5s ease'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Caja de Herramientas Colectiva & DUA */}
          <div 
            className="mgmt-card"
            style={{
              padding: '24px 26px',
              marginBottom: '26px',
              backgroundColor: 'rgba(255, 254, 250, 0.90)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(16, 36, 32, 0.07)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: 'rgba(217, 119, 6, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                <Lightbulb size={18} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#142B25', margin: 0 }}>
                Caja de Herramientas Colectiva & Inclusión DUA en la Institución
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#4A655D', margin: '0 0 18px 0' }}>
              Estrategias de apertura de clase, criterios de evaluación formativa y pautas DUA más recurrentes en el claustro.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              
              <div style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#183630', margin: '0 0 10px 0' }}>
                  🚀 Dinámicas de Inicio Predilectas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(adnInstitucional?.dinamicasFrecuentes || []).slice(0, 3).map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#2B453E' }}>
                      <Check size={14} style={{ color: '#16A34A', flexShrink: 0 }} />
                      <span>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#183630', margin: '0 0 10px 0' }}>
                  📋 Formas de Evaluación Formativa
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(adnInstitucional?.estilosEvaluacion || []).slice(0, 3).map((e, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#2B453E' }}>
                      <Check size={14} style={{ color: '#2563EB', flexShrink: 0 }} />
                      <span>{e.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#183630', margin: '0 0 10px 0' }}>
                  🧩 Flexibilización Curricular (DUA)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(adnInstitucional?.enfoquesDua || []).slice(0, 3).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#2B453E' }}>
                      <Check size={14} style={{ color: '#10B981', flexShrink: 0 }} />
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Banco Institucional de Recursos Probados */}
          <div 
            className="mgmt-card"
            style={{
              padding: '24px 26px',
              marginBottom: '26px',
              backgroundColor: 'rgba(255, 254, 250, 0.90)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(16, 36, 32, 0.07)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: 'rgba(234, 179, 8, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                  <Star size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#142B25', margin: 0 }}>
                    Banco de Recursos Probados con Alta Efectividad en Aula
                  </h3>
                  <p style={{ fontSize: '13px', color: '#4A655D', margin: 0 }}>
                    Materiales generados por la comunidad docente validados con excelente respuesta pedagógica de los estudiantes.
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', backgroundColor: 'rgba(22, 163, 74, 0.12)', padding: '4px 12px', borderRadius: '999px' }}>
                ⭐ Máxima Calificación (5.0 / 5.0)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
              {(adnInstitucional?.recursosProbados || []).slice(0, 4).map((rec, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: '16px 18px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                    borderRadius: '14px', 
                    border: '1px solid rgba(49, 91, 84, 0.16)',
                    boxShadow: '0 2px 8px rgba(16, 36, 32, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#183630', backgroundColor: 'rgba(71, 122, 114, 0.12)', padding: '2px 8px', borderRadius: '999px' }}>
                      {rec.type}
                    </span>
                    <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                      {'★'.repeat(rec.engagement || 5)}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                    {rec.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#415B54', margin: '0 0 8px 0', lineHeight: 1.45 }}>
                    "{rec.notaDocente || 'Validado exitosamente en aula con estudiantes.'}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#166534', fontWeight: 600 }}>
                    <CheckCircle2 size={13} />
                    <span>{rec.efectividad || 'Alta efectividad en el aula'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directorio de Huella Curricular por Docente */}
          <div 
            className="mgmt-card" 
            style={{ 
              padding: '0', 
              overflow: 'hidden', 
              width: '100%', 
              boxSizing: 'border-box', 
              marginBottom: '32px',
              backgroundColor: 'rgba(255, 254, 250, 0.90)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              borderRadius: '22px',
              boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
            }}
          >
            <div style={{ padding: '20px 24px 14px 24px', borderBottom: '1px solid rgba(49, 91, 84, 0.14)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#142B25', margin: '0 0 4px 0' }}>
                  Directorio de Huella Curricular Docente
                </h3>
                <p style={{ fontSize: '13px', color: '#4A655D', margin: 0 }}>
                  Resumen de la metodología preferida e índice de innovación de cada docente registrado.
                </p>
              </div>

              {/* Filtros específicos de la huella docente */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div className="mgmt-search-box" style={{ minWidth: '220px', maxWidth: '300px' }}>
                  <Search size={15} color="var(--primary-sage)" />
                  <input 
                    type="text" 
                    placeholder="Filtrar"
                    value={searchDnaTerm}
                    onChange={(e) => setSearchDnaTerm(e.target.value)}
                    className="mgmt-search-input"
                    aria-label="Filtrar docentes en análisis de ADN"
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Todos', 'Primaria', 'Secundaria', 'Media'].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFilterDnaLevel(n)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        border: '1px solid rgba(49, 91, 84, 0.2)',
                        backgroundColor: filterDnaLevel === n ? '#183630' : 'rgba(255, 255, 255, 0.7)',
                        color: filterDnaLevel === n ? '#FFFFFF' : '#142B25',
                        cursor: 'pointer'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* VISTA ESCRITORIO / TABLET: Tabla Completa */}
            <div className="admin-table-desktop-view" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(71, 122, 114, 0.10)', borderBottom: '1px solid rgba(49, 91, 84, 0.16)' }}>
                    <th style={{ padding: '12px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Docente</th>
                    <th style={{ padding: '12px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Nivel / Institución</th>
                    <th style={{ padding: '12px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Planes</th>
                    <th style={{ padding: '12px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Metodología Predilecta</th>
                    <th style={{ padding: '12px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Índice Innovación</th>
                    <th style={{ padding: '12px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Eje Transversal</th>
                    <th style={{ padding: '12px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {((adnInstitucional?.resumenDocentes || []).filter(t => {
                    const q = searchDnaTerm.toLowerCase();
                    const matchSearch = !q || 
                      (t.nombre || '').toLowerCase().includes(q) ||
                      (t.email || '').toLowerCase().includes(q) ||
                      (t.institucion || '').toLowerCase().includes(q) ||
                      (t.metodologiaFavorita || '').toLowerCase().includes(q);
                    const matchLevel = filterDnaLevel === 'Todos' || (t.nivel && t.nivel.toLowerCase().includes(filterDnaLevel.toLowerCase()));
                    return matchSearch && matchLevel;
                  })).map((t, index) => (
                    <tr 
                      key={t.id || index}
                      style={{ 
                        borderBottom: '1px solid rgba(49, 91, 84, 0.08)',
                        backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
                        fontSize: '13px'
                      }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(71, 122, 114, 0.18)', color: '#1C3D36', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                            {(t.nombre || 'D').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#142B25' }}>{t.nombre}</div>
                            <div style={{ fontSize: '11px', color: '#576864' }}>{t.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#2B453E', fontWeight: 500 }}>
                        {t.nivel} - {t.institucion}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#142B25', fontWeight: 700 }}>
                        {t.planesCount}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {t.hasRegisteredMetodologia && t.metodologiaFavorita ? (
                          <span style={{ backgroundColor: 'rgba(49, 91, 84, 0.10)', color: '#183630', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                            {t.metodologiaFavorita}
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706' }}></span>
                            Pendiente por registrar
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {t.indiceInnovacion !== null && t.indiceInnovacion !== undefined ? (
                          <span style={{ backgroundColor: t.indiceInnovacion >= 60 ? 'rgba(22, 163, 74, 0.14)' : 'rgba(217, 119, 6, 0.14)', color: t.indiceInnovacion >= 60 ? '#166534' : '#92400E', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                            {t.indiceInnovacion}%
                          </span>
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '12px', fontStyle: 'italic' }}>
                            — (0 planes)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#3A544C', fontSize: '12px' }}>
                        {t.hasRegisteredEje && t.ejeTransversal ? (
                          t.ejeTransversal
                        ) : (
                          <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Sin registrar</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedDocenteDna(t)}
                          className="btn btn-secondary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                          title="Ver Ficha Curricular Detallada"
                        >
                          <Eye size={13} />
                          <span>Ver Ficha</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VISTA MÓVIL: Tarjetas de ADN Pedagógico Docente */}
            <div className="admin-cards-mobile-view" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {((adnInstitucional?.resumenDocentes || []).filter(t => {
                const q = searchDnaTerm.toLowerCase();
                const matchSearch = !q || 
                  (t.nombre || '').toLowerCase().includes(q) ||
                  (t.email || '').toLowerCase().includes(q) ||
                  (t.institucion || '').toLowerCase().includes(q) ||
                  (t.metodologiaFavorita || '').toLowerCase().includes(q);
                const matchLevel = filterDnaLevel === 'Todos' || (t.nivel && t.nivel.toLowerCase().includes(filterDnaLevel.toLowerCase()));
                return matchSearch && matchLevel;
              })).map((t, index) => (
                <div
                  key={t.id || index}
                  style={{
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(49, 91, 84, 0.16)',
                    boxShadow: '0 2px 8px rgba(16, 36, 32, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#1C3D36', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                        {(t.nombre || 'D').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#142B25' }}>{t.nombre}</div>
                        <div style={{ fontSize: '12px', color: '#4A655D' }}>{t.email}</div>
                      </div>
                    </div>
                    {t.indiceInnovacion !== null && t.indiceInnovacion !== undefined && (
                      <span style={{ backgroundColor: t.indiceInnovacion >= 60 ? 'rgba(22, 163, 74, 0.14)' : 'rgba(217, 119, 6, 0.14)', color: t.indiceInnovacion >= 60 ? '#166534' : '#92400E', padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                        {t.indiceInnovacion}% Innovación
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', padding: '10px', backgroundColor: '#F8FAF9', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>
                      <span style={{ color: '#576864' }}>Colegio / Nivel:</span> <strong>{t.institucion || 'Colegio'} ({t.nivel || 'General'})</strong>
                    </div>
                    <div>
                      <span style={{ color: '#576864' }}>Metodología:</span> <strong>{t.metodologiaFavorita || 'Estándar Institucional'}</strong>
                    </div>
                    {t.ejeTransversal && (
                      <div>
                        <span style={{ color: '#576864' }}>Proyecto Transversal:</span> <strong>{t.ejeTransversal}</strong>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>
                      {t.planesCount} planes registrados
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDocenteDna(t)}
                      className="btn-outline"
                      style={{ padding: '6px 14px', fontSize: '12px', minHeight: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF' }}
                    >
                      <Eye size={13} />
                      <span>Ver Ficha Completa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Ficha Curricular Docente */}
          {selectedDocenteDna && createPortal(
            <div className="modal-glass-backdrop" onClick={() => setSelectedDocenteDna(null)}>
              <div 
                className="modal-glass-panel" 
                onClick={(e) => e.stopPropagation()} 
                style={{ 
                  maxWidth: '560px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(255, 254, 250, 0.96)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 20px 60px rgba(16, 36, 32, 0.22)',
                  border: '1px solid rgba(255, 255, 255, 0.98)'
                }}
              >
                <div className="modal-glass-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(71, 122, 114, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontWeight: 800, fontSize: '16px' }}>
                      {(selectedDocenteDna.nombre || 'D').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#142B25' }}>
                        Ficha Curricular Docente
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#4A655D' }}>
                        Trazabilidad pedagógica y ADN registrado en plataforma
                      </p>
                    </div>
                  </div>
                  <button className="btn-icon" onClick={() => setSelectedDocenteDna(null)} aria-label="Cerrar modal">
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-glass-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '14px 16px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#142B25', marginBottom: '2px' }}>
                      {selectedDocenteDna.nombre}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#4A655D' }}>
                      {selectedDocenteDna.email}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#183630', fontWeight: 600 }}>
                      🏫 {selectedDocenteDna.institucion || 'Colegio'} • {selectedDocenteDna.nivel || 'Nivel Primaria/Secundaria'}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '12px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                      <span style={{ fontSize: '11px', color: '#4A655D', fontWeight: 600, display: 'block' }}>Planes en Plataforma</span>
                      <strong style={{ fontSize: '20px', color: '#142B25' }}>{selectedDocenteDna.planesCount}</strong>
                    </div>

                    <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '12px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                      <span style={{ fontSize: '11px', color: '#4A655D', fontWeight: 600, display: 'block' }}>Índice de Innovación</span>
                      <strong style={{ fontSize: '18px', color: (selectedDocenteDna.indiceInnovacion && selectedDocenteDna.indiceInnovacion >= 60) ? '#166534' : '#92400E' }}>
                        {selectedDocenteDna.indiceInnovacion !== null && selectedDocenteDna.indiceInnovacion !== undefined 
                          ? `${selectedDocenteDna.indiceInnovacion}%`
                          : '— (0 planes)'}
                      </strong>
                    </div>
                  </div>

                  <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '12px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <span style={{ fontSize: '11.5px', color: '#4A655D', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Metodología Líder / Institucional</span>
                    {selectedDocenteDna.hasRegisteredMetodologia && selectedDocenteDna.metodologiaFavorita ? (
                      <span style={{ backgroundColor: 'rgba(49, 91, 84, 0.12)', color: '#183630', padding: '3px 10px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 700, display: 'inline-block' }}>
                        {selectedDocenteDna.metodologiaFavorita}
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'inline-block' }}>
                        Pendiente por registrar
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '12px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <span style={{ fontSize: '11.5px', color: '#4A655D', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Proyecto Transversal Vinculado</span>
                    <span style={{ fontSize: '13px', color: selectedDocenteDna.hasRegisteredEje ? '#142B25' : '#64748B', fontWeight: 600, fontStyle: selectedDocenteDna.hasRegisteredEje ? 'normal' : 'italic' }}>
                      {selectedDocenteDna.hasRegisteredEje && selectedDocenteDna.ejeTransversal ? selectedDocenteDna.ejeTransversal : 'Sin registrar'}
                    </span>
                  </div>

                  <div style={{ padding: '12px 14px', backgroundColor: selectedDocenteDna.hasCustomDna ? 'rgba(220, 252, 231, 0.8)' : 'rgba(254, 243, 199, 0.8)', borderRadius: '12px', border: '1px solid rgba(49, 91, 84, 0.14)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Dna size={16} style={{ color: selectedDocenteDna.hasCustomDna ? '#166534' : '#92400E' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: selectedDocenteDna.hasCustomDna ? '#166534' : '#92400E' }}>
                      {selectedDocenteDna.hasCustomDna 
                        ? 'ADN Docente Personalizado y sincronizado en Firestore' 
                        : 'Utilizando el Estándar Curricular Institucional por defecto'}
                    </span>
                  </div>
                </div>

                <div className="modal-glass-footer">
                  <button className="btn btn-primary" onClick={() => setSelectedDocenteDna(null)} style={{ padding: '8px 22px' }}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

        </div>
      )}

      {/* ========================================================
          PESTAÑA 4: TICKETS DE SOPORTE TÉCNICO
          ======================================================== */}
      {activeTab === 'Tickets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', boxSizing: 'border-box', marginBottom: '40px' }}>
          {tickets.length === 0 ? (
            <div 
              className="mgmt-empty-card" 
              style={{ 
                width: '100%', 
                boxSizing: 'border-box',
                backgroundColor: 'rgba(255, 254, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '24px',
                boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
              }}
            >
              <ShieldAlert size={36} color="var(--primary-sage)" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#142B25', margin: '0 0 8px 0' }}>
                No hay tickets de soporte pendientes
              </h3>
              <p style={{ color: '#2B453E', fontSize: '14px', margin: 0 }}>
                Todas las solicitudes técnicas docentes han sido atendidas exitosamente.
              </p>
            </div>
          ) : (
            tickets.map(t => (
              <div 
                key={t.id} 
                className="mgmt-card" 
                style={{ 
                  padding: '24px 28px', 
                  width: '100%', 
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(255, 254, 250, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.94)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', color: '#142B25', margin: 0, fontWeight: 700 }}>{t.asunto}</h3>
                  <span style={{ 
                    backgroundColor: t.estado === 'Pendiente' ? '#FEF3C7' : '#DCFCE7', 
                    color: t.estado === 'Pendiente' ? '#92400E' : '#166534',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {t.estado}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#2F4840', margin: '0 0 10px 0' }}>
                  De: <strong>{t.nombre}</strong> ({t.email})
                </p>

                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '14px 18px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px', color: '#142B25', border: '1px solid rgba(49, 91, 84, 0.16)', lineHeight: '1.5' }}>
                  {t.descripcion}
                </div>
                
                {t.estado === 'Pendiente' ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Respuesta" 
                      value={replyText[t.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                      className="wizard-input"
                      style={{ flex: 1, minWidth: '240px' }}
                      aria-label="Respuesta al ticket"
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleRespond(t.id)} 
                      style={{ padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Send size={15} /> Responder
                    </button>
                  </div>
                ) : (
                  <div style={{ borderLeft: '3px solid #183630', paddingLeft: '14px', marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '12px', color: '#183630', margin: '0 0 4px 0' }}>Respuesta de Administración:</p>
                      <p style={{ fontSize: '14px', color: '#142B25', margin: 0 }}>{t.respuestaAdmin}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
