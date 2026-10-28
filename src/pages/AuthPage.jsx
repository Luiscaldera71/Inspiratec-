import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';
import TermsAndConditionsModal from '../components/TermsAndConditionsModal';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isHoveringForm, setIsHoveringForm] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    institucion: '',
    nivel: '',
    metodologiaInstitucional: 'Aprendizaje Basado en Proyectos (ABP)',
    otraMetodologia: '',
    aceptaTerminos: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const loggedUser = await loginUser(formData.email, formData.password);
        if (loggedUser?.uid) {
          localStorage.setItem(`inspiratec_bienvenida_completada_${loggedUser.uid}`, 'true');
          localStorage.removeItem(`inspiratec_just_registered_${loggedUser.uid}`);
        }
        sessionStorage.removeItem('inspiratec_just_registered');
      } else {
        if (!formData.aceptaTerminos) {
          throw new Error('Debes aceptar los Términos y Condiciones y la Política de Protección de Datos (Ley 1581 de 2012) para registrarte.');
        }
        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener mínimo 6 caracteres.');
        }
        const metodologiaFinal = formData.metodologiaInstitucional === 'Otra'
          ? (formData.otraMetodologia || 'Aprendizaje Activo Personalizado').trim()
          : (formData.metodologiaInstitucional || 'Aprendizaje Basado en Proyectos (ABP)');

        const newUser = await registerUser(
          formData.nombre,
          formData.institucion,
          formData.nivel,
          formData.email,
          formData.password,
          '',
          formData.aceptaTerminos,
          metodologiaFinal
        );

        // Señalizar que el usuario se acaba de registrar para abrir el tutorial una única vez
        if (newUser?.uid) {
          sessionStorage.setItem('inspiratec_just_registered', newUser.uid);
          localStorage.setItem(`inspiratec_just_registered_${newUser.uid}`, 'true');
        }
      }
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error en la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const scenes = [
    {
      id: "campus",
      image: "/login-scenes/campus.jpg",
      titleStart: "Ideas hoy, ",
      titleHighlight: "mejores aulas",
      titleEnd: " mañana.",
      description: "Explora nuevas posibilidades educativas con tecnología, creatividad y propósito pedagógico."
    },
    {
      id: "criterio-docente",
      image: "/login-scenes/criterio-docente.jpg",
      titleStart: "Tu ",
      titleHighlight: "criterio docente",
      titleEnd: " importa.",
      description: "La IA propone; tú contextualizas, contrastas, validas y decides."
    },
    {
      id: "inclusion",
      image: "/login-scenes/inclusion.jpg",
      titleStart: "Inclusión ",
      titleHighlight: "desde el diseño.",
      titleEnd: "",
      description: "Considera diferentes formas de aprender, participar y demostrar lo aprendido."
    },
    {
      id: "colaboracion",
      image: "/login-scenes/colaboracion.jpg",
      titleStart: "Aprender también es ",
      titleHighlight: "compartir.",
      titleEnd: "",
      description: "Conecta experiencias, contrasta ideas y construye conocimiento educativo con otros docentes."
    },
    {
      id: "innovacion",
      image: "/login-scenes/innovacion.jpg",
      titleStart: "Innovar con ",
      titleHighlight: "propósito.",
      titleEnd: "",
      description: "Transforma necesidades educativas en propuestas que puedas revisar y llevar a la práctica."
    }
  ];

  useEffect(() => {
    let timer;
    if (!isHoveringForm) {
      timer = setInterval(() => {
        setCurrentScene((prev) => (prev + 1) % scenes.length);
      }, 7000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isHoveringForm, scenes.length]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: '#000' }}>
      
      {/* Fondos Cinematográficos */}
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className="scene-bg"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${scene.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentScene === index ? 1 : 0,
            transform: currentScene === index ? 'scale(1)' : 'scale(1.03)',
            transition: 'opacity 1.2s ease-in-out, transform 8s ease-out',
            zIndex: 0
          }}
        />
      ))}

      {/* Degradado oscuro progresivo para el texto */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Estilos adicionales para responsividad */}
      <style>
        {`
          @media (max-width: 900px) {
            .mobile-gradient {
              background: linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.4) 100%) !important;
            }
            .auth-container {
              flex-direction: column !important;
              min-height: 100vh !important;
              overflow-y: auto !important;
            }
            .narrative-panel {
              width: 100% !important;
              padding: 32px 20px 16px !important;
              justify-content: flex-start !important;
              flex: none !important;
            }
            .form-wrapper {
              padding: 16px 20px 48px !important;
              width: 100% !important;
              justify-content: center !important;
              align-items: center !important;
              box-sizing: border-box !important;
            }
            .form-panel {
              width: 100% !important;
              max-width: 440px !important;
              border-radius: 24px !important;
              border: 1px solid rgba(255,255,255,0.4) !important;
              padding: 28px 20px !important;
              flex: none !important;
              max-height: none !important;
              box-sizing: border-box !important;
            }
            .narrative-title {
              font-size: clamp(24px, 5vw, 32px) !important;
              text-shadow: 0 2px 10px rgba(0,0,0,0.8) !important;
            }
            .narrative-desc {
              font-size: 14.5px !important;
              text-shadow: 0 2px 8px rgba(0,0,0,0.8) !important;
              max-width: 100% !important;
            }
          }
          @media (max-width: 480px) {
            .auth-row-2col {
              grid-template-columns: 1fr !important;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .scene-bg {
              transform: none !important;
              transition: opacity 1.2s ease-in-out !important;
            }
          }
        `}
      </style>
      <div className="mobile-gradient" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

      {/* Contenedor Principal */}
      <div className="auth-container" style={{ position: 'relative', zIndex: 2, display: 'flex', minHeight: '100vh', width: '100%' }}>
        
        {/* Panel Izquierdo: Narrativa */}
        <div className="narrative-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', color: '#FFF' }}>
          
          <div style={{ maxWidth: '640px', marginTop: 'auto', marginBottom: 'auto' }}>
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(10px)',
              color: '#FFF', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              fontSize: '13px', 
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginBottom: '24px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              INSPIRATEC
            </span>
            
            <div style={{ position: 'relative', minHeight: '180px' }}>
              {scenes.map((scene, index) => (
                <div 
                  key={scene.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: currentScene === index ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    visibility: currentScene === index ? 'visible' : 'hidden',
                    pointerEvents: currentScene === index ? 'auto' : 'none'
                  }}
                >
                  <h1 className="narrative-title" style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.15', margin: '0 0 16px 0', textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}>
                    {scene.titleStart}
                    <span style={{ color: '#10b981' }}>{scene.titleHighlight}</span>
                    {scene.titleEnd}
                  </h1>
                  <div style={{ width: '40px', height: '4px', backgroundColor: '#14b8a6', borderRadius: '2px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
                  <p className="narrative-desc" style={{ fontSize: '18px', lineHeight: '1.5', color: '#e2e8f0', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.7)', maxWidth: '90%' }}>
                    {scene.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Controles inferiores del Carrusel */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
              {scenes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScene(index)}
                  style={{
                    width: currentScene === index ? '36px' : '12px',
                    height: '6px',
                    borderRadius: '4px',
                    backgroundColor: currentScene === index ? '#10b981' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                  aria-label={`Ir a escena ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Panel Derecho: Formulario */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 60px 40px 40px', flexShrink: 0 }} className="form-wrapper">
          <div 
            className="form-panel"
            style={{ 
              width: '440px', 
              backgroundColor: 'rgba(24, 35, 34, 0.4)', 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '28px',
              display: 'flex', 
              flexDirection: 'column',
              padding: '48px 40px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto'
            }}
            onMouseEnter={() => setIsHoveringForm(true)}
            onMouseLeave={() => setIsHoveringForm(false)}
          >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#F8FAFC', fontSize: '28px', marginBottom: '8px', fontFamily: 'Georgia, serif', letterSpacing: '1px', fontWeight: 'bold' }}>
              INSPIRATEC
            </h2>
            <p style={{ color: '#E2E8F0', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>
              {isLogin ? 'Inicia sesión para continuar creando experiencias educativas' : 'Crea tu cuenta docente protegida y únete a la comunidad'}
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #FCA5A5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>Nombre Completo</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej. Profe María Pérez" style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0F172A' }} />
                </div>

                <div className="auth-row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>Institución</label>
                    <input type="text" name="institucion" value={formData.institucion} onChange={handleChange} required placeholder="Colegio..." style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0F172A' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>Nivel</label>
                    <select name="nivel" value={formData.nivel} onChange={handleChange} required style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0F172A' }}>
                      <option value="">Selecciona...</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>
                    Metodología o Enfoque Institucional
                  </label>
                  <select 
                    name="metodologiaInstitucional" 
                    value={formData.metodologiaInstitucional} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0F172A' }}
                  >
                    <option value="Aprendizaje Basado en Proyectos (ABP)">Aprendizaje Basado en Proyectos (ABP)</option>
                    <option value="Enfoque STEAM Interdisciplinario">Enfoque STEAM Interdisciplinario</option>
                    <option value="Aprendizaje Cooperativo y Socrático">Aprendizaje Cooperativo y Socrático</option>
                    <option value="Aula Invertida (Flipped Classroom)">Aula Invertida (Flipped Classroom)</option>
                    <option value="Enseñanza para la Comprensión (EpC)">Enseñanza para la Comprensión (EpC)</option>
                    <option value="Socioformativo o por Competencias">Socioformativo o por Competencias</option>
                    <option value="Constructivismo y Aprendizaje Significativo">Constructivismo y Aprendizaje Significativo</option>
                    <option value="Escuela Nueva / Metodologías Activas">Escuela Nueva / Metodologías Activas</option>
                    <option value="Otra">Otra metodología (especificar)...</option>
                  </select>
                </div>

                {formData.metodologiaInstitucional === 'Otra' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>
                      Escribe la metodología de tu colegio
                    </label>
                    <input 
                      type="text" 
                      name="otraMetodologia" 
                      value={formData.otraMetodologia} 
                      onChange={handleChange} 
                      required 
                      placeholder="Ej.: Pedagogía dialogante" 
                      style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0F172A' }} 
                    />
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="tu.correo@institucion.edu.co" style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0F172A' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
              <label style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  minLength="6" 
                  placeholder="••••••••"
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', width: '100%', boxSizing: 'border-box', paddingRight: '40px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0F172A' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#64748B', display: 'flex', alignItems: 'center' }}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && <small style={{ color: '#CBD5E1', marginTop: '2px', display: 'block', fontSize: '11px' }}>Mínimo 6 caracteres</small>}
            </div>

            {/* Checkbox de Términos y Condiciones */}
            {!isLogin && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '4px'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '12px', color: '#F8FAFC', lineHeight: '1.4' }}>
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    style={{ marginTop: '2px', cursor: 'pointer', accentColor: 'var(--primary-active)' }}
                  />
                  <span>
                    He leído y acepto los{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary-active)', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Términos y Condiciones
                    </button>{' '}
                    (Ley 1581 / Habeas Data).
                  </span>
                </label>
              </div>
            )}

            <button 
              type="submit" 
              style={{ marginTop: '12px', width: '100%', padding: '14px', backgroundColor: 'var(--primary-active)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-sage)')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-active)')}
            >
              {loading ? 'Procesando...' : isLogin ? 'Ingresar' : 'Registrarme'}
            </button>
          </form>

          {/* Badge de Seguridad */}
          <div style={{
            marginTop: '24px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#F8FAFC'
          }}>
            <Shield size={14} color="#14b8a6" />
            <span>Protección con JWT y Cifrado</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              style={{ background: 'none', border: 'none', color: '#F8FAFC', cursor: 'pointer', fontSize: '14px', textDecoration: 'none' }}
            >
              {isLogin ? (
                <>¿No tienes cuenta? <span style={{ color: 'var(--primary-active)', fontWeight: '700' }}>Regístrate aquí</span></>
              ) : (
                <>¿Ya tienes cuenta? <span style={{ color: 'var(--primary-active)', fontWeight: '700' }}>Inicia sesión</span></>
              )}
            </button>
          </div>
          </div>
        </div>
      </div>

      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setFormData(prev => ({ ...prev, aceptaTerminos: true }))}
      />
    </div>
  );
}
