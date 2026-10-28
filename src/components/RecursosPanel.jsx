import { useMemo, useState } from 'react';
import {
  Presentation, Gamepad2, Puzzle, FlaskConical, Map, KeyRound, Users, MessageSquare,
  HelpCircle, ListChecks, CheckCircle2, FileText, BookOpen, Layers, Dices, LayoutGrid,
  Clock, BarChart3, Download, Trash2, Maximize2, Sparkles, Loader2, GalleryHorizontal, QrCode, Radio
} from 'lucide-react';
import { RESOURCE_CATALOG, RESOURCE_CATEGORIES, resolveResourceKey } from '../services/materials/resourceCatalog';

const ICONS = {
  presentation: Presentation, slides: GalleryHorizontal, timeline: Clock, chart: BarChart3, book: BookOpen,
  game: Gamepad2, puzzle: Puzzle, cards: Layers, steps: ListChecks, dice: Dices, board: LayoutGrid,
  flask: FlaskConical, map: Map, key: KeyRound, users: Users, chat: MessageSquare, help: HelpCircle,
  list: ListChecks, check: CheckCircle2, file: FileText, qr: QrCode, radio: Radio
};

const green = '#315B54';

/**
 * RecursosPanel
 * Catálogo de recursos HTML que se pueden generar a partir del tema de la clase y lista de
 * los recursos que ya tiene el plan. Un plan puede tener varios recursos (incluso del mismo tipo).
 */
export default function RecursosPanel({
  recursosAnexos = [],
  isGenerating = false,
  generatingKey = null,
  onGenerate,
  onOpen,
  onDownload,
  onRemove
}) {
  const [categoria, setCategoria] = useState('todos');

  const visibles = useMemo(
    () => RESOURCE_CATALOG.filter(r => categoria === 'todos' || r.categoria === categoria),
    [categoria]
  );

  const conteo = (typeKey) =>
    (recursosAnexos || []).filter(a => resolveResourceKey(a?.typeKey) === typeKey).length;

  return (
    <section aria-labelledby="titulo-recursos" style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <h3 id="titulo-recursos" style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#142B25', fontFamily: 'var(--font-heading)' }}>
          Recursos
        </h3>
        <span style={{ fontSize: '12.5px', color: '#576864' }}>
          {RESOURCE_CATALOG.length} tipos disponibles
        </span>
      </div>

      <div role="tablist" aria-label="Categorías de recursos" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[{ id: 'todos', label: 'Todos' }, ...RESOURCE_CATEGORIES].map(c => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={categoria === c.id}
            onClick={() => setCategoria(c.id)}
            style={{
              padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${categoria === c.id ? green : 'rgba(49, 91, 84, 0.25)'}`,
              background: categoria === c.id ? green : 'transparent',
              color: categoria === c.id ? '#fff' : '#142B25'
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
        {visibles.map(r => {
          const Icon = ICONS[r.icono] || Sparkles;
          const n = conteo(r.typeKey);
          const generandoEste = isGenerating && generatingKey === r.typeKey;
          return (
            <div
              key={r.typeKey}
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', borderRadius: '14px',
                background: '#fff', border: r.plantilla ? '1.5px solid #D4AF37' : '1px solid rgba(49, 91, 84, 0.18)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(71, 122, 114, 0.14)', color: '#142B25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} />
                </span>
                <strong style={{ fontSize: '14.5px', color: '#142B25', lineHeight: 1.3 }}>{r.nombre}</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: '#4B5563', flex: 1 }}>{r.descripcion}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                {n > 0 ? (
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#03543F' }}>✓ {n} en el plan</span>
                ) : <span />}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isGenerating}
                  onClick={() => onGenerate(r)}
                  style={{ padding: '7px 14px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
                >
                  {generandoEste ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                  {generandoEste ? 'Generando…' : r.accion ? 'Crear' : n > 0 ? 'Generar otro' : 'Generar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {recursosAnexos.length > 0 && (
        <div style={{ marginTop: '30px', borderTop: '2px dashed var(--border-color)', paddingTop: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '18px', color: '#142B25', fontFamily: 'var(--font-heading)' }}>
            Recursos de este plan ({recursosAnexos.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recursosAnexos.map((recurso, idx) => (
              <div
                key={recurso.id || `${recurso.title}-${idx}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(49, 91, 84, 0.18)' }}
              >
                <div style={{ minWidth: 0, flex: '1 1 240px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#142B25', overflowWrap: 'anywhere' }}>{recurso.title}</div>
                  <div style={{ fontSize: '12px', color: '#576864' }}>
                    {recurso.tipo || 'Recurso'}{recurso.anexadoAt ? ` · ${new Date(recurso.anexadoAt).toLocaleDateString('es-CO')}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" className="btn-outline" onClick={() => onOpen(recurso)} style={{ padding: '6px 12px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Maximize2 size={13} /> Abrir
                  </button>
                  <button type="button" className="btn" onClick={() => onDownload(recurso)} style={{ padding: '6px 12px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary-sage)' }}>
                    <Download size={13} /> Descargar
                  </button>
                  <button type="button" className="btn-outline" onClick={() => onRemove(idx)} aria-label={`Quitar ${recurso.title}`} style={{ padding: '6px 10px', fontSize: '12.5px', color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.35)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
