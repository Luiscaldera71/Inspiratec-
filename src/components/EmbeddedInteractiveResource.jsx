import React, { useState, useId } from 'react';
import { 
  Sparkles, 
  Loader2, 
  Download, 
  Maximize2, 
  CheckCircle2, 
  RefreshCw, 
  PlusCircle, 
  AlertCircle,
  Eye,
  X,
  Share2
} from 'lucide-react';
import { generateHtmlResource } from '../services/aiService';
import { useAppStore } from '../store/useAppStore';

/**
 * EmbeddedInteractiveResource
 * Componente interactivo embebido que sustituye la etiqueta [GENERATE_IMAGE: "..."]
 * en la vista del plan de clase.
 * 
 * Permite al docente generar bajo demanda un recurso interactivo autónomo en HTML,
 * visualizarlo en un iframe aislado seguro, descargarlo como archivo .html o anexarlo al plan.
 */
export default function EmbeddedInteractiveResource({ prompt = '', title = 'Recurso Pedagógico Interactivo' }) {
  const { apiKey, addRecursoAnexo, recursosAnexos, activePlanMetadata } = useAppStore();
  const componentId = useId();

  // Limpiar el prompt de comillas accidentales
  const cleanPrompt = (prompt || '').replace(/^["'\s]+|["'\s]+$/g, '').trim();

  // Si el recurso ya fue generado antes, se recupera del plan para que "quede ahí"
  const savedResource = (recursosAnexos || []).find(r => r.prompt === cleanPrompt && r.html);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setHtmlContent] = useState('');
  const htmlContent = generatedHtml || savedResource?.html || '';
  const [error, setError] = useState(null);
  const [isAnexado, setIsAnexado] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Por favor, configura tu API Key en la sección de Configuración para generar este recurso.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const html = await generateHtmlResource(apiKey, cleanPrompt, {
        tema: activePlanMetadata?.tema,
        grado: activePlanMetadata?.grado,
        area: activePlanMetadata?.area
      });
      setHtmlContent(html);
      // Se anexa automáticamente al plan para que persista al guardar
      addRecursoAnexo({
        title: cleanPrompt.length > 50 ? `${cleanPrompt.slice(0, 50)}...` : cleanPrompt,
        prompt: cleanPrompt,
        html,
        tipo: 'Recurso Interactivo Embebido',
        anexadoAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('[INSPIRATEC] Error al generar recurso interactivo:', err);
      setError(err.message || 'No fue posible generar el recurso interactivo. Intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = (cleanPrompt.slice(0, 30).replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_') || 'recurso_interactivo') + '.html';
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleShare = async () => {
    if (!htmlContent) return;
    const filename = (cleanPrompt.slice(0, 30).replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_') || 'recurso_interactivo') + '.html';

    if (typeof File !== 'undefined' && navigator.canShare) {
      try {
        const file = new File([htmlContent], filename, { type: 'text/html' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: cleanPrompt,
            text: `Recurso didáctico interactivo: ${cleanPrompt}`,
            files: [file]
          });
          return;
        }
      } catch (e) {
        if (e.name !== 'AbortError') console.warn(e);
        else return;
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanPrompt,
          text: `★ Recurso Interactivo INSPIRATEC: ${cleanPrompt}\nÁbrelo en cualquier navegador web.`
        });
        return;
      } catch (e) {
        if (e.name !== 'AbortError') console.warn(e);
        else return;
      }
    }

    handleDownload();
  };

  const handleAnexar = () => {
    if (!htmlContent) return;
    const nuevoRecurso = {
      title: cleanPrompt.length > 50 ? `${cleanPrompt.slice(0, 50)}...` : cleanPrompt,
      prompt: cleanPrompt,
      html: htmlContent,
      tipo: 'Recurso Interactivo Embebido',
      anexadoAt: new Date().toISOString()
    };
    addRecursoAnexo(nuevoRecurso);
    setIsAnexado(true);
    setTimeout(() => setIsAnexado(false), 3000);
  };

  return (
    <div 
      className="generatable-resource-wrapper"
      style={{
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Cabecera y Sugerencia Interactiva */}
      <div 
        className="generatable-resource-header"
        style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: '12px', 
          marginBottom: htmlContent ? '16px' : '12px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div 
          className="generatable-resource-info"
          style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'flex-start',
            minWidth: 0,
            flex: '1 1 240px',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(71, 122, 114, 0.14)', 
              color: '#142B25', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={18} />
          </div>
          <div style={{ minWidth: 0, flex: 1, maxWidth: '100%' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#315B54', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px', wordBreak: 'break-word' }}>
              Recurso sugerido
            </div>
            <div 
              className="generatable-resource-prompt"
              style={{ 
                fontSize: '14.5px', 
                fontWeight: 600, 
                color: '#142B25', 
                lineHeight: '1.45',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere'
              }}
            >
              "{cleanPrompt}"
            </div>
          </div>
        </div>

        {/* Botón de Generar si aún no está generado */}
        {!htmlContent && !isGenerating && (
          <button
            type="button"
            className="btn btn-primary generate-resource-button"
            onClick={handleGenerate}
            style={{
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#315B54',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxSizing: 'border-box',
              lineHeight: '1.3'
            }}
          >
            <Sparkles size={15} style={{ flexShrink: 0 }} /> <span>Generar recurso</span>
          </button>
        )}
      </div>

      {/* Estado: Cargando / Generando */}
      {isGenerating && (
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 20px', 
            backgroundColor: 'rgba(49, 91, 84, 0.05)', 
            borderRadius: '14px',
            border: '1px dashed rgba(49, 91, 84, 0.3)',
            marginTop: '12px'
          }}
        >
          <Loader2 size={32} className="spin" style={{ color: '#315B54', marginBottom: '12px' }} />
          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#142B25' }}>
            Generando recurso interactivo...
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#576864', textAlign: 'center', maxWidth: '440px' }}>
            Puede tardar hasta un minuto.
          </p>
        </div>
      )}

      {/* Estado: Error */}
      {error && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '12px 16px', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '10px',
            marginTop: '12px',
            color: '#DC2626',
            fontSize: '13.5px'
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>{error}</div>
          <button 
            type="button" 
            className="btn" 
            onClick={handleGenerate}
            style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', borderRadius: '6px' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado: Recurso Generado (Iframe interactivo + Barra de herramientas) */}
      {htmlContent && (
        <div style={{ marginTop: '14px' }}>
          {/* Iframe contenedor seguro */}
          <div 
            style={{ 
              width: '100%', 
              height: '420px', 
              borderRadius: '14px', 
              overflow: 'hidden', 
              border: '1px solid rgba(49, 91, 84, 0.25)', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              backgroundColor: '#FFFFFF',
              position: 'relative'
            }}
          >
            <iframe
              srcDoc={htmlContent}
              title={cleanPrompt}
              className="generated-resource-iframe"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>

          {/* Barra de Acciones del Recurso */}
          <div 
            className="generatable-resource-actions"
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: '10px', 
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(49, 91, 84, 0.12)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div className="generatable-resource-btn-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleShare}
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  color: '#142B25',
                  borderRadius: '8px',
                  border: '1px solid #D4AF37',
                  cursor: 'pointer'
                }}
                title="Compartir recurso con estudiantes o colegas"
              >
                <Share2 size={14} style={{ color: '#B45309' }} /> Compartir
              </button>

              <button
                type="button"
                className="btn btn-secondary action-button"
                onClick={handleDownload}
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#315B54',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Descargar HTML
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsFullscreenModalOpen(true)}
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  color: '#142B25',
                  borderRadius: '8px',
                  border: '1px solid rgba(49, 91, 84, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <Maximize2 size={14} /> Ver en Ventana
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleAnexar}
                disabled={isAnexado}
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isAnexado ? 'rgba(22, 163, 74, 0.12)' : 'transparent',
                  color: isAnexado ? '#166534' : '#142B25',
                  borderColor: isAnexado ? '#166534' : 'rgba(49, 91, 84, 0.3)',
                  borderRadius: '8px',
                  cursor: isAnexado ? 'default' : 'pointer'
                }}
              >
                {isAnexado ? <CheckCircle2 size={14} /> : <PlusCircle size={14} />}
                {isAnexado ? '¡Anexado al plan!' : 'Anexar al Plan'}
              </button>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleGenerate}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: '#576864',
                cursor: 'pointer'
              }}
              title="Regenerar recurso interactivo"
            >
              <RefreshCw size={13} /> Regenerar
            </button>
          </div>
        </div>
      )}

      {/* Modal Pantalla Completa */}
      {isFullscreenModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(16, 36, 32, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px'
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              color: '#FFFFFF',
              marginBottom: '16px' 
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                {cleanPrompt}
              </h3>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>Recurso interactivo HTML independiente</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleShare}
                style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', border: '1px solid #D4AF37', borderRadius: '8px', cursor: 'pointer' }}
                title="Compartir recurso con colegas o estudiantes"
              >
                <Share2 size={14} style={{ color: '#FACC15' }} /> Compartir
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownload}
                style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#315B54', color: '#FFF', border: 'none', borderRadius: '8px' }}
              >
                <Download size={14} /> Descargar HTML
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreenModalOpen(false)}
                style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <iframe
              srcDoc={htmlContent}
              title={cleanPrompt}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
