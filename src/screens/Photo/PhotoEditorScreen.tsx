import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
  SafeAreaView,
  Modal,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const rs = (size: number) => Math.round(size * scale);

const COLORS = {
  primary:   '#E8294C',
  secondary: '#8A2BE2',
  bgDark:    '#0D0D0D',
  bgCard:    '#1A1A1A',
  bgLight:   '#242424',
  text:      '#FFFFFF',
  textGray:  '#AAAAAA',
  textMuted: '#666666',
  success:   '#22C55E',
  warning:   '#F59E0B',
};

const TOOLS = [
  { id: 'adjust',  label: 'Régler',      icon: '☀️' },
  { id: 'crop',    label: 'Recadrer',    icon: '⊡'  },
  { id: 'filter',  label: 'Filtres',     icon: '🎨' },
  { id: 'text',    label: 'Texte',       icon: 'T'  },
  { id: 'sticker', label: 'Autocollant', icon: '⭐' },
];

const RATIOS = [
  { id: 'free', label: 'Libre', icon: '∞'  },
  { id: '1:1',  label: '1:1',  icon: '■'  },
  { id: '16:9', label: '16:9', icon: '▬'  },
  { id: '9:16', label: '9:16', icon: '▮'  },
  { id: '4:3',  label: '4:3',  icon: '▭'  },
  { id: '3:4',  label: '3:4',  icon: '▯'  },
];

const FILTERS = [
  { id: 'normal',  label: 'Normal',  color: '#888' },
  { id: 'warm',    label: 'Chaud',   color: '#FF8C42' },
  { id: 'cool',    label: 'Froid',   color: '#3B82F6' },
  { id: 'vintage', label: 'Vintage', color: '#C8A26D' },
  { id: 'bw',      label: 'N&B',     color: '#CCC' },
  { id: 'vivid',   label: 'Vif',     color: '#22C55E' },
];

const STICKERS = ['❤️','🔥','⭐','🎉','✨','💎','🌈','🚀','😊','🎨'];

interface Props {
  navigation: any;
}

export default function PhotoEditorScreen({ navigation }: Props) {
  const [activeTool, setActiveTool]         = useState('adjust');
  const [selectedRatio, setSelectedRatio]   = useState('free');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [showExport, setShowExport]         = useState(false);

  // Ajustements
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast]     = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [warmth, setWarmth]         = useState(0);
  const [sharpness, setSharpness]   = useState(0);

  const adjustments = [
    { id: 'brightness', label: 'Luminosité', icon: '☀️', value: brightness, min: -100, max: 100, setter: setBrightness },
    { id: 'contrast',   label: 'Contraste',  icon: '◑',  value: contrast,   min: -100, max: 100, setter: setContrast   },
    { id: 'saturation', label: 'Saturation', icon: '🎨', value: saturation, min: -100, max: 100, setter: setSaturation },
    { id: 'warmth',     label: 'Chaleur',    icon: '🌡', value: warmth,     min: -100, max: 100, setter: setWarmth     },
    { id: 'sharpness',  label: 'Netteté',    icon: '◈',  value: sharpness,  min: 0,    max: 100, setter: setSharpness  },
  ];

  // Slider manuel par paliers
  const stepValue = (current: number, step: number, min: number, max: number, setter: (v: number) => void) => {
    const next = Math.min(max, Math.max(min, current + step));
    setter(next);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* ══════════ HEADER ══════════ */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Éditeur Photo</Text>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => setShowExport(true)}
            >
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>

          {/* ══════════ PRÉVISUALISATION ══════════ */}
          <View style={styles.preview}>
            <View style={styles.previewBg}>
              <Text style={styles.previewEmoji}>🖼️</Text>
              <Text style={styles.previewLabel}>Votre photo</Text>
            </View>

            {/* Actions rapides */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickBtn}>
                <Text style={styles.quickBtnText}>↔ Miroir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn}>
                <Text style={styles.quickBtnText}>↻ Rotation</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ══════════ BARRE D'OUTILS ══════════ */}
          <View style={styles.toolBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toolBarContent}
            >
              {TOOLS.map((tool) => (
                <TouchableOpacity
                  key={tool.id}
                  style={[
                    styles.toolBtn,
                    activeTool === tool.id && styles.toolBtnActive,
                  ]}
                  onPress={() => setActiveTool(tool.id)}
                >
                  <Text style={styles.toolBtnIcon}>{tool.icon}</Text>
                  <Text style={[
                    styles.toolBtnLabel,
                    activeTool === tool.id && styles.toolBtnLabelActive,
                  ]}>
                    {tool.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ══════════ PANNEAU ══════════ */}
          <View style={styles.panel}>

            {/* ── AJUSTEMENTS ── */}
            {activeTool === 'adjust' && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.panelContent}
              >
                {adjustments.map((adj) => (
                  <View key={adj.id} style={styles.adjRow}>
                    <View style={styles.adjHeader}>
                      <Text style={styles.adjIcon}>{adj.icon}</Text>
                      <Text style={styles.adjLabel}>{adj.label}</Text>
                      <Text style={styles.adjValue}>
                        {adj.value > 0 ? `+${adj.value}` : adj.value}
                      </Text>
                    </View>

                    {/* Slider par boutons +/- */}
                    <View style={styles.adjControls}>
                      <TouchableOpacity
                        style={styles.adjBtn}
                        onPress={() => stepValue(adj.value, -10, adj.min, adj.max, adj.setter)}
                      >
                        <Text style={styles.adjBtnText}>−</Text>
                      </TouchableOpacity>

                      {/* Barre visuelle */}
                      <View style={styles.adjBar}>
                        <View style={[
                          styles.adjFill,
                          {
                            width: `${((adj.value - adj.min) / (adj.max - adj.min)) * 100}%` as any,
                          },
                        ]} />
                        {/* Marqueur centre */}
                        <View style={styles.adjCenter} />
                      </View>

                      <TouchableOpacity
                        style={styles.adjBtn}
                        onPress={() => stepValue(adj.value, 10, adj.min, adj.max, adj.setter)}
                      >
                        <Text style={styles.adjBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* ── RECADRER ── */}
            {activeTool === 'crop' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>Ratio d'image</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: rs(10) }}
                >
                  {RATIOS.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      style={[
                        styles.ratioBtn,
                        selectedRatio === r.id && styles.ratioBtnActive,
                      ]}
                      onPress={() => setSelectedRatio(r.id)}
                    >
                      <Text style={[
                        styles.ratioIcon,
                        selectedRatio === r.id && styles.ratioIconActive,
                      ]}>
                        {r.icon}
                      </Text>
                      <Text style={[
                        styles.ratioLabel,
                        selectedRatio === r.id && styles.ratioLabelActive,
                      ]}>
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Text style={styles.panelHint}>
                  🤌 Pincez pour zoomer · Faites glisser pour repositionner
                </Text>
              </View>
            )}

            {/* ── FILTRES ── */}
            {activeTool === 'filter' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>Filtres Photo</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: rs(12) }}
                >
                  {FILTERS.map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      style={[
                        styles.filterCard,
                        selectedFilter === f.id && styles.filterCardActive,
                      ]}
                      onPress={() => setSelectedFilter(f.id)}
                    >
                      <View style={[
                        styles.filterPreview,
                        { backgroundColor: f.color },
                      ]} />
                      <Text style={[
                        styles.filterName,
                        selectedFilter === f.id && styles.filterNameActive,
                      ]}>
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── TEXTE ── */}
            {activeTool === 'text' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>✏️ Ajouter du texte</Text>
                <Text style={styles.panelHint}>
                  Appuyez sur la photo pour placer du texte
                </Text>
                <View style={styles.textStyles}>
                  {['Normal', 'Gras', 'Ombre', 'Contour'].map((s) => (
                    <TouchableOpacity key={s} style={styles.textStyleBtn}>
                      <Text style={styles.textStyleLabel}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── AUTOCOLLANTS ── */}
            {activeTool === 'sticker' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>⭐ Autocollants</Text>
                <View style={styles.stickerGrid}>
                  {STICKERS.map((emoji) => (
                    <TouchableOpacity key={emoji} style={styles.stickerBtn}>
                      <Text style={styles.stickerEmoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

          </View>

        </View>
      </SafeAreaView>

      {/* ══════════ MODAL EXPORT ══════════ */}
      <Modal
        visible={showExport}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExport(false)}
      >
        <View style={styles.exportOverlay}>
          <View style={styles.exportSheet}>
            <View style={styles.exportHandle} />
            <Text style={styles.exportTitle}>Enregistrer & Partager</Text>

            {[
              { icon: '💾', label: 'Enregistrer dans la galerie' },
              { icon: '📸', label: 'Instagram' },
              { icon: '📘', label: 'Facebook'  },
              { icon: '🐦', label: 'X (Twitter)' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.exportOpt}
                onPress={() => {
                  setShowExport(false);
                  Alert.alert('✅', `Export vers ${opt.label} lancé !`);
                }}
              >
                <Text style={styles.exportOptIcon}>{opt.icon}</Text>
                <Text style={styles.exportOptLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.exportCancel}
              onPress={() => setShowExport(false)}
            >
              <Text style={styles.exportCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgDark },
  container: { flex: 1, backgroundColor: COLORS.bgDark },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(16),
    paddingVertical: rs(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  closeBtn: {
    width: rs(36),
    height: rs(36),
    borderRadius: rs(18),
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: COLORS.text, fontSize: rs(16) },
  headerTitle: { color: COLORS.text, fontSize: rs(16), fontWeight: '700' },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(16),
    paddingVertical: rs(8),
    borderRadius: rs(20),
  },
  saveBtnText: { color: COLORS.text, fontWeight: '700', fontSize: rs(13) },

  // Preview
  preview: {
    height: height * 0.3,
    backgroundColor: '#111',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  previewEmoji: { fontSize: rs(56) },
  previewLabel: { color: COLORS.textMuted, fontSize: rs(13), marginTop: rs(8) },
  quickActions: {
    position: 'absolute',
    bottom: rs(10),
    right: rs(12),
    flexDirection: 'row',
    gap: rs(8),
  },
  quickBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: rs(10),
    paddingVertical: rs(5),
    borderRadius: rs(8),
  },
  quickBtnText: { color: COLORS.text, fontSize: rs(11), fontWeight: '600' },

  // Toolbar
  toolBar: {
    backgroundColor: COLORS.bgCard,
    paddingVertical: rs(6),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  toolBarContent: { paddingHorizontal: rs(8), gap: rs(4) },
  toolBtn: {
    alignItems: 'center',
    paddingHorizontal: rs(12),
    paddingVertical: rs(6),
    borderRadius: rs(8),
    minWidth: rs(58),
  },
  toolBtnActive: {
    backgroundColor: COLORS.bgLight,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  toolBtnIcon: { fontSize: rs(18), marginBottom: rs(2) },
  toolBtnLabel: { color: COLORS.textMuted, fontSize: rs(10), textAlign: 'center' },
  toolBtnLabelActive: { color: COLORS.primary },

  // Panel
  panel: { flex: 1, backgroundColor: COLORS.bgDark },
  panelContent: { padding: rs(16) },
  panelTitle: {
    color: COLORS.text,
    fontSize: rs(14),
    fontWeight: '700',
    marginBottom: rs(14),
  },
  panelHint: {
    color: COLORS.textMuted,
    fontSize: rs(12),
    marginTop: rs(12),
  },

  // Ajustements
  adjRow: { marginBottom: rs(16) },
  adjHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: rs(8) },
  adjIcon: { fontSize: rs(14), marginRight: rs(6) },
  adjLabel: { color: COLORS.textGray, fontSize: rs(13), flex: 1 },
  adjValue: { color: COLORS.textMuted, fontSize: rs(13), fontFamily: 'monospace', width: rs(36), textAlign: 'right' },
  adjControls: { flexDirection: 'row', alignItems: 'center', gap: rs(10) },
  adjBtn: {
    width: rs(32),
    height: rs(32),
    borderRadius: rs(16),
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  adjBtnText: { color: COLORS.text, fontSize: rs(18), fontWeight: '300' },
  adjBar: {
    flex: 1,
    height: rs(6),
    backgroundColor: COLORS.bgLight,
    borderRadius: rs(3),
    overflow: 'hidden',
    position: 'relative',
  },
  adjFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: rs(3),
  },
  adjCenter: {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: rs(2),
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Ratio
  ratioBtn: {
    alignItems: 'center',
    paddingHorizontal: rs(14),
    paddingVertical: rs(10),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: rs(60),
  },
  ratioBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(232,41,76,0.1)',
  },
  ratioIcon: { fontSize: rs(22), color: COLORS.textMuted },
  ratioIconActive: { color: COLORS.primary },
  ratioLabel: { color: COLORS.textMuted, fontSize: rs(11), marginTop: rs(4) },
  ratioLabelActive: { color: COLORS.primary, fontWeight: '700' },

  // Filtres
  filterCard: {
    alignItems: 'center',
    borderRadius: rs(10),
    borderWidth: 2,
    borderColor: 'transparent',
    padding: rs(4),
  },
  filterCardActive: { borderColor: COLORS.primary },
  filterPreview: {
    width: rs(64),
    height: rs(64),
    borderRadius: rs(10),
    marginBottom: rs(6),
  },
  filterName: { color: COLORS.textMuted, fontSize: rs(11) },
  filterNameActive: { color: COLORS.primary, fontWeight: '700' },

  // Texte
  textStyles: { flexDirection: 'row', gap: rs(10), flexWrap: 'wrap', marginTop: rs(12) },
  textStyleBtn: {
    paddingHorizontal: rs(16),
    paddingVertical: rs(10),
    backgroundColor: COLORS.bgCard,
    borderRadius: rs(10),
  },
  textStyleLabel: { color: COLORS.textGray, fontSize: rs(13) },

  // Stickers
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs(10),
  },
  stickerBtn: {
    width: rs(52),
    height: rs(52),
    borderRadius: rs(26),
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerEmoji: { fontSize: rs(28) },

  // Export
  exportOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  exportSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: rs(24),
    borderTopRightRadius: rs(24),
    padding: rs(24),
    paddingBottom: rs(40),
  },
  exportHandle: {
    width: rs(40),
    height: rs(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: rs(2),
    alignSelf: 'center',
    marginBottom: rs(16),
  },
  exportTitle: {
    color: COLORS.text,
    fontSize: rs(18),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: rs(20),
  },
  exportOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(14),
    paddingVertical: rs(14),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  exportOptIcon: { fontSize: rs(28) },
  exportOptLabel: { color: COLORS.text, fontSize: rs(15) },
  exportCancel: {
    marginTop: rs(16),
    backgroundColor: COLORS.bgLight,
    borderRadius: rs(14),
    padding: rs(14),
    alignItems: 'center',
  },
  exportCancelText: { color: COLORS.text, fontWeight: '600', fontSize: rs(15) },
});
