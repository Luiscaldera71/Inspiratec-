import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { auth } from '../firebase';
import { logoutUser, changeUserPassword, updateUserProfile } from '../services/authService';
import { 
  User, 
  Key, 
  LogOut, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Edit2, 
  Save, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Loader2, 
  Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function UserMenu({ placement = 'bottom', isSidebar = false }) {
  const { userProfile } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 0, left: 'auto', bottom: 'auto' });
  const menuRef = useRef();

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!menuRef.current) return;
      const rect = menuRef.current.getBoundingClientRect();
      const popoverWidth = 260;

      if (placement === 'top') {
        setPopoverPos({
          bottom: window.innerHeight - rect.top + 8,
          top: 'auto',
          left: Math.max(12, Math.min(rect.left, window.innerWidth - popoverWidth - 12)),
          right: 'auto'
        });
      } else {
        const rightSpace = window.innerWidth - rect.right;
        if (rightSpace + popoverWidth <= window.innerWidth - 12) {
          setPopoverPos({
            top: rect.bottom + 8,
            right: Math.max(12, rightSpace),
            left: 'auto',
            bottom: 'auto'
          });
        } else {
          setPopoverPos({
            top: rect.bottom + 8,
            left: Math.max(12, rect.left),
            right: 'auto',
            bottom: 'auto'
          });
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, placement]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Si el clic no fue dentro del botón ni del popover
        const popoverEl = document.querySelector('.user-menu-popover-glass');
        if (!popoverEl || !popoverEl.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isAdmin = userProfile?.rol === 'Admin' || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com');
  const roleName = isAdmin ? 'Admin' : (userProfile?.rol || 'Docente');

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', width: isSidebar ? '100%' : 'auto' }}>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menú de usuario y cuenta"
        className={isSidebar ? "user-menu-btn sidebar-variant" : "user-menu-btn"}
      >
        <div style={{ 
          width: isSidebar ? '32px' : '28px', 
          height: isSidebar ? '32px' : '28px', 
          borderRadius: '50%', 
          background: isSidebar ? 'var(--color-brand-primary, #315B54)' : '#315B54', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: '700', 
          fontSize: isSidebar ? '14px' : '12.5px',
          flexShrink: 0
        }}>
          {roleName.charAt(0)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', overflow: 'hidden' }}>
          <span style={{ fontSize: '13px', color: isSidebar ? '#FFFFFF' : '#1E3D37', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userProfile?.nombre || roleName}
          </span>
          {isSidebar && (
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
              {roleName}
            </span>
          )}
        </div>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Telón ambiental desenfocado que desenfoca la pantalla de fondo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="user-menu-backdrop"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />

              {/* Popover desacoplado con desenfoque de cristal y nitidez total */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: placement === 'top' ? -8 : 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: placement === 'top' ? -8 : 8 }}
                transition={{ duration: 0.16 }}
                className="user-menu-popover-glass"
                style={{
                  position: 'fixed',
                  top: popoverPos.top,
                  bottom: popoverPos.bottom,
                  right: popoverPos.right,
                  left: popoverPos.left,
                  zIndex: 1000
                }}
              >
                <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(49, 91, 84, 0.12)', background: 'rgba(71, 122, 114, 0.08)' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#142B25', fontSize: '14px' }}>
                    {userProfile?.nombre || 'Usuario INSPIRATEC'}
                  </p>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#4A5551', wordBreak: 'break-all' }}>
                    {auth.currentUser?.email}
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: isAdmin ? 'rgba(124, 58, 237, 0.12)' : 'rgba(71, 122, 114, 0.15)',
                      color: isAdmin ? '#6D28D9' : '#1C3A34',
                      display: 'inline-block'
                    }}>
                      {roleName}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '8px' }}>
                  <button className="user-menu-item-glass" onClick={() => { setIsOpen(false); setShowProfile(true); }}>
                    <User size={15} style={{ color: '#315B54' }} /> Mi Perfil
                  </button>
                  <button className="user-menu-item-glass" onClick={() => { setIsOpen(false); setShowPassword(true); }}>
                    <Key size={15} style={{ color: '#315B54' }} /> Cambiar Contraseña
                  </button>
                  <button className="user-menu-item-glass" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('open-bienvenida')); }}>
                    <Sparkles size={15} style={{ color: '#D4AF37' }} /> Bienvenida INSPIRATEC
                  </button>
                </div>

                <div style={{ padding: '8px', borderTop: '1px solid rgba(49, 91, 84, 0.1)' }}>
                  <button className="user-menu-item-glass danger" onClick={() => { setIsOpen(false); logoutUser(); }}>
                    <LogOut size={15} /> Cerrar Sesión
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} profile={userProfile} email={auth.currentUser?.email} role={roleName} />
      <PasswordModal isOpen={showPassword} onClose={() => setShowPassword(false)} />

      <style>{`
        .user-menu-btn:hover { background: rgba(255, 253, 249, 0.75) !important; }
        .user-menu-btn.sidebar-variant:hover { background: rgba(255, 255, 255, 0.16) !important; }
      `}</style>
    </div>
  );
}

function ProfileModal({ isOpen, onClose, profile, email, role }) {
  const { setUserProfile, userId } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nombre: '', institucion: '', celular: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && profile) {
      setEditData({
        nombre: profile.nombre || '',
        institucion: profile.institucion || '',
        celular: profile.celularDesencriptado || profile.celular || ''
      });
      setIsEditing(false);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, profile]);

  // Manejo de scroll de fondo y tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!editData.nombre.trim()) {
      setErrorMsg('El nombre completo es obligatorio.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateUserProfile(userId, editData);
      setUserProfile({
        ...profile,
        ...editData,
        celularDesencriptado: editData.celular
      });
      setSuccessMsg('Perfil docente actualizado exitosamente.');
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMsg('');
      }, 1400);
    } catch (e) {
      console.error(e);
      setErrorMsg('Error al actualizar perfil. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div 
      className="modal-glass-backdrop" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="modal-glass-card" style={{ maxWidth: '490px' }}>
        
        {/* Encabezado */}
        <div className="modal-glass-header">
          <h3 id="profile-modal-title" className="modal-glass-title">
            <User size={19} style={{ color: 'var(--color-brand-active)' }} /> 
            Información del Docente
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="modal-glass-close-btn"
            aria-label="Cerrar modal de perfil"
          >
            <X size={17} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="modal-glass-body">
          {/* Badge de seguridad institucional */}
          <div style={{ 
            backgroundColor: 'rgba(71, 122, 114, 0.12)', 
            border: '1px solid rgba(71, 122, 114, 0.28)', 
            borderRadius: '12px', 
            padding: '10px 14px', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            fontSize: '12px', 
            color: '#142B25' 
          }}>
            <ShieldCheck size={18} style={{ color: '#166534', flexShrink: 0 }} />
            <span><strong>Sesión JWT Verificada</strong> & Cifrado de datos personales activo (Ley 1581).</span>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(254, 242, 242, 0.9)', color: '#DC2626', border: '1px solid rgba(252, 165, 165, 0.8)', borderRadius: '10px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(240, 253, 244, 0.9)', color: '#166534', border: '1px solid rgba(187, 247, 208, 0.8)', borderRadius: '10px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Nombre */}
            <div>
              <label style={{ fontSize: '12px', color: '#3D5A53', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                Nombre Completo
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  value={editData.nombre} 
                  onChange={e => setEditData({ ...editData, nombre: e.target.value })} 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.3)', backgroundColor: '#FFFFFF', color: '#142B25', fontSize: '14px' }} 
                  autoFocus
                />
              ) : (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.1)', color: '#142B25', fontSize: '14.5px', fontWeight: 600 }}>
                  {profile?.nombre || 'No definido'}
                </div>
              )}
            </div>

            {/* Correo Electrónico */}
            <div>
              <label style={{ fontSize: '12px', color: '#3D5A53', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                Correo Electrónico
              </label>
              <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.1)', color: '#475569', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{email || 'No definido'}</span>
                <span style={{ fontSize: '11px', color: '#64748B', backgroundColor: 'rgba(71, 122, 114, 0.1)', padding: '2px 8px', borderRadius: '999px' }}>
                  Solo lectura
                </span>
              </div>
            </div>

            {/* Celular / WhatsApp */}
            <div>
              <label style={{ fontSize: '12px', color: '#3D5A53', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                Celular / WhatsApp <span style={{ fontSize: '11px', fontWeight: 500, color: '#477A72' }}>(Protegido Habeas Data)</span>
              </label>
              {isEditing ? (
                <input 
                  type="tel"
                  value={editData.celular} 
                  onChange={e => setEditData({ ...editData, celular: e.target.value })} 
                  placeholder="Ej. +57 300 123 4567" 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.3)', backgroundColor: '#FFFFFF', color: '#142B25', fontSize: '14px' }} 
                />
              ) : (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.1)', color: '#142B25', fontSize: '14px' }}>
                  {profile?.celularDesencriptado || profile?.celular || 'No registrado'}
                </div>
              )}
            </div>

            {/* Rol Asignado */}
            <div>
              <label style={{ fontSize: '12px', color: '#3D5A53', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                Rol Asignado
              </label>
              <div>
                <span style={{ 
                  background: role === 'Admin' ? 'rgba(124, 58, 237, 0.14)' : 'rgba(71, 122, 114, 0.15)', 
                  color: role === 'Admin' ? '#6D28D9' : '#1C3A34', 
                  border: `1px solid ${role === 'Admin' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(71, 122, 114, 0.3)'}`,
                  padding: '5px 14px', 
                  borderRadius: '20px', 
                  fontSize: '12.5px', 
                  fontWeight: 700,
                  display: 'inline-block' 
                }}>
                  {role}
                </span>
              </div>
            </div>

            {/* Institución */}
            <div>
              <label style={{ fontSize: '12px', color: '#3D5A53', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                Institución Educativa
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  value={editData.institucion} 
                  onChange={e => setEditData({ ...editData, institucion: e.target.value })} 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.3)', backgroundColor: '#FFFFFF', color: '#142B25', fontSize: '14px' }} 
                />
              ) : (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.1)', color: '#142B25', fontSize: '14px' }}>
                  {profile?.institucion || 'No definida'}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Pie con acciones */}
        <div className="modal-glass-footer">
          {isEditing ? (
            <>
              <button 
                type="button"
                onClick={() => setIsEditing(false)} 
                className="editor-btn-pill"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSave} 
                disabled={loading} 
                className="btn btn-primary"
                style={{ padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {loading ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </>
          ) : (
            <>
              <button 
                type="button" 
                onClick={onClose} 
                className="editor-btn-pill"
              >
                Cerrar
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                className="btn btn-primary"
                style={{ padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: '7px' }}
              >
                <Edit2 size={15} /> Editar Información
              </button>
            </>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}

function PasswordModal({ isOpen, onClose }) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Estados independientes para mostrar/ocultar contraseñas
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Manejo de scroll de fondo y tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  // Limpiar campos al abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setError('');
      setSuccess(false);
      setShowCurrentPass(false);
      setShowNewPass(false);
      setShowConfirmPass(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPass.length < 6) {
      setError('La nueva contraseña debe tener como mínimo 6 caracteres.');
      return;
    }

    if (newPass !== confirmNewPass) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await changeUserPassword(currentPass, newPass);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      if (err.message === 'invalid-credential') setError('La contraseña actual ingresada es incorrecta.');
      else if (err.message === 'weak-password') setError('La nueva contraseña es muy débil (usa al menos 6 caracteres combinando letras y números).');
      else if (err.message === 'requires-recent-login') setError('Por motivos de seguridad, debes cerrar sesión y volver a ingresar para autorizar el cambio.');
      else setError('Ocurrió un error al actualizar la contraseña: ' + (err.message || 'Error de servicio.'));
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div 
      className="modal-glass-backdrop" 
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div className="modal-glass-card" style={{ maxWidth: '440px' }}>
        
        {/* Encabezado */}
        <div className="modal-glass-header">
          <h3 id="password-modal-title" className="modal-glass-title">
            <Key size={19} style={{ color: 'var(--color-brand-active)' }} /> 
            Cambiar Contraseña
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="modal-glass-close-btn"
            aria-label="Cerrar modal de cambio de contraseña"
          >
            <X size={17} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="modal-glass-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0', animation: 'modalFadeIn 0.3s ease-out' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#10B981' }}>
                <CheckCircle size={36} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', color: '#142B25', fontSize: '18px', fontWeight: 700 }}>
                ¡Contraseña Actualizada!
              </h4>
              <p style={{ margin: 0, color: '#3D5A53', fontSize: '13.5px' }}>
                Tu clave ha sido reautenticada y modificada correctamente en el sistema.
              </p>
            </div>
          ) : (
            <form id="change-password-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Contraseña Actual */}
              <div>
                <label htmlFor="current-password-input" style={{ fontSize: '12.5px', color: '#142B25', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  Contraseña Actual
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    id="current-password-input"
                    type={showCurrentPass ? "text" : "password"} 
                    required 
                    value={currentPass} 
                    onChange={e => setCurrentPass(e.target.value)} 
                    style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.28)', backgroundColor: '#FFFFFF', color: '#142B25', fontSize: '14px' }} 
                    placeholder="Ingresa tu clave actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    aria-label={showCurrentPass ? "Ocultar contraseña actual" : "Mostrar contraseña actual"}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label htmlFor="new-password-input" style={{ fontSize: '12.5px', color: '#142B25', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  Nueva Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    id="new-password-input"
                    type={showNewPass ? "text" : "password"} 
                    required 
                    value={newPass} 
                    onChange={e => setNewPass(e.target.value)} 
                    style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.28)', backgroundColor: '#FFFFFF', color: '#142B25', fontSize: '14px' }} 
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    aria-label={showNewPass ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div>
                <label htmlFor="confirm-password-input" style={{ fontSize: '12.5px', color: '#142B25', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  Confirmar Nueva Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    id="confirm-password-input"
                    type={showConfirmPass ? "text" : "password"} 
                    required 
                    value={confirmNewPass} 
                    onChange={e => setConfirmNewPass(e.target.value)} 
                    style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.28)', backgroundColor: '#FFFFFF', color: '#142B25', fontSize: '14px' }} 
                    placeholder="Repite la nueva clave"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    aria-label={showConfirmPass ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(254, 242, 242, 0.9)', color: '#DC2626', border: '1px solid rgba(252, 165, 165, 0.8)', borderRadius: '10px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} /> 
                  <span>{error}</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Pie de acciones */}
        {!success && (
          <div className="modal-glass-footer">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="editor-btn-pill"
            >
              Cancelar
            </button>
            <button 
              form="change-password-form"
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
              style={{ padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? <Loader2 size={16} className="spin" /> : <Lock size={15} />}
              <span>{loading ? 'Verificando con Firebase...' : 'Actualizar Contraseña'}</span>
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
