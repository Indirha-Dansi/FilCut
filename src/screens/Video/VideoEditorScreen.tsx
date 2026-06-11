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
  accent:    '#FF6B35',
  gold:      '#FFB800',
  bgDark:    '#0D0D0D',
  bgCard:    '#1A1A1A',
  bgLight:   '#242424',
  text:      '#FFFFFF',
  textGray:  '#AAAAAA',
  textMuted: '#666666',
  success:   '#22C55E',
};

// ── Onglets outils ────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'cut',        label: 'Couper',     icon: '✂️' },
  { id: 'speed',      label: 'Vitesse',    icon: '⚡' },
  { id: 'audio',      label: 'Audio',      icon: '🎵' },
  { id: 'text',       label: 'Texte',      icon: 'T'  },
  { id: 'filter',     label: 'Filtre',     icon: '🎨' },
  { id: 'effect',     label: 'Effets',     icon: '✨' },
  { id: 'transition', label: 'Transition', icon: '▷▷' },
  { id: 'compress',   label: 'Compresser', icon: '📦' },
  { id: 'convert',    label: 'Convertir',  icon: '🔄' },
];

// ── Filtres ───────────────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'normal',  label: 'Normal',     color: '#888' },
  { id: 'vintage', label: 'Vintage',    color: '#C8A26D' },
  { id: 'glitch',  label: 'Glitch',     color: '#00FFFF' },
  { id: 'retro',   label: 'Rétro DV',   color: '#FFB347' },
  { id: 'noise',   label: 'Analogique', color: '#AAA' },
  { id: 'beats',   label: 'Beats Sync', color: '#E8294C' },
];

// ── Effets ────────────────────────────────────────────────────────────────────
const EFFECTS = [
  { id: 'glitch',      label: 'Glitch',       icon: '⚡', isPro: false },
  { id: 'blur_border', label: 'Flou Bordure', icon: '◻', isPro: false },
  { id: 'beats',       label: 'Beats Sync',   icon: '🎵', isPro: false },
  { id: 'ai_caption',  label: 'Légendes IA',  icon: '💬', isPro: true  },
  { id: 'ai_style',    label: 'Styles IA Lab',icon: '🤖', isPro: true  },
];

// ── Transitions ───────────────────────────────────────────────────────────────
const TRANSITIONS = [
  { id: 'none',     label: 'Aucune',    icon: '—'  },
  { id: 'dissolve', label: 'Dissolve',  icon: '◎'  },
  { id: 'whipzoom', label: 'Whip Zoom', icon: '→'  },
  { id: 'fade',     label: 'Fondu',     icon: '◐'  },
];

interface Props {
  navigation: any;
}

export default function VideoEditorScreen({ navigation }: Props) {
  const [activeTool, setActiveTool]         = useState('cut');
  const [speed, setSpeed]                   = useState(1);
  const [volume, setVolume]                 = useState(80);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [selectedTransition, setSelectedTransition] = useState('none');
  const [isPlaying, setIsPlaying]           = useState(false);
  const [showExport, setShowExport]         = useState(false);
  const isPro = false;

  const showPaywall = () => {
    Alert.alert(
      '⭐ FilCut Pro',
      "Pour 4,99€, libérez la puissance de l'IA !",
      [
        { text: 'Pas maintenant', style: 'cancel' },
        { text: 'Débloquer — 4,99€', onPress: () => {} },
      ],
    );
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
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

            <Text style={styles.headerTitle}>Éditeur Vidéo</Text>

            <TouchableOpacity
              style={styles.exportHeaderBtn}
              onPress={() => setShowExport(true)}
            >
              <Text style={styles.exportHeaderText}>Exporter</Text>
            </TouchableOpacity>
          </View>

          {/* ══════════ PRÉVISUALISATION ══════════ */}
          <View style={styles.preview}>
            <View style={styles.previewBg}>
              <Text style={styles.previewEmoji}>🎬</Text>
              <Text style={styles.previewLabel}>Prévisualisation</Text>
            </View>

            {/* Timecode */}
            <View style={styles.timecode}>
              <Text style={styles.timecodeText}>0:00 / 0:30</Text>
            </View>

            {/* Contrôles lecture */}
            <View style={styles.playControls}>
              <TouchableOpacity style={styles.playControlBtn}>
                <Text style={styles.playControlIcon}>⏮</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playMainBtn}
                onPress={() => setIsPlaying(!isPlaying)}
              >
                <Text style={styles.playMainIcon}>
                  {isPlaying ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.playControlBtn}>
                <Text style={styles.playControlIcon}>⏭</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ══════════ TIMELINE ══════════ */}
          <View style={styles.timeline}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timelineContent}
            >
              {/* Piste vidéo */}
              <View style={styles.trackRow}>
                <Text style={styles.trackIcon}>🎬</Text>
                <View style={[styles.clip, { backgroundColor: COLORS.primary, width: rs(160) }]}>
                  <Text style={styles.clipText}>Clip 1</Text>
                </View>
                <View style={[styles.clip, { backgroundColor: COLORS.secondary, width: rs(100), marginLeft: rs(3) }]}>
                  <Text style={styles.clipText}>Clip 2</Text>
                </View>
              </View>

              {/* Piste audio */}
              <View style={[styles.trackRow, { marginTop: rs(4) }]}>
                <Text style={styles.trackIcon}>🎵</Text>
                <View style={[styles.clip, { backgroundColor: COLORS.success, width: rs(240), height: rs(18) }]}>
                  <Text style={[styles.clipText, { fontSize: rs(9) }]}>Audio</Text>
                </View>
              </View>
            </ScrollView>

            {/* Curseur de lecture */}
            <View style={styles.playhead} />
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

          {/* ══════════ PANNEAU ACTIF ══════════ */}
          <View style={styles.panel}>

            {/* ── COUPER ── */}
            {activeTool === 'cut' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>✂️ Outils de Coupe</Text>
                <View style={styles.cutGrid}>
                  {[
                    { icon: '✂️', label: 'Découper' },
                    { icon: '⊠',  label: 'Rogner'   },
                    { icon: '⊞',  label: 'Fusionner' },
                    { icon: '🗑',  label: 'Supprimer' },
                  ].map((btn) => (
                    <TouchableOpacity key={btn.label} style={styles.cutBtn}>
                      <Text style={styles.cutBtnIcon}>{btn.icon}</Text>
                      <Text style={styles.cutBtnLabel}>{btn.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── VITESSE ── */}
            {activeTool === 'speed' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>⚡ Vitesse : {speed}x</Text>
                <View style={styles.speedBtns}>
                  {[0.5, 1, 1.5, 2, 4].map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.speedBtn,
                        speed === s && styles.speedBtnActive,
                      ]}
                      onPress={() => setSpeed(s)}
                    >
                      <Text style={[
                        styles.speedBtnText,
                        speed === s && styles.speedBtnTextActive,
                      ]}>
                        {s}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── AUDIO ── */}
            {activeTool === 'audio' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>🎵 Studio Audio</Text>
                <View style={styles.audioRow}>
                  <Text style={styles.audioLabel}>Volume : {volume}%</Text>
                  <View style={styles.volumeBar}>
                    <View style={[styles.volumeFill, { width: `${volume}%` as any }]} />
                  </View>
                  <View style={styles.audioPresets}>
                    {[0, 50, 80, 100].map((v) => (
                      <TouchableOpacity
                        key={v}
                        style={[styles.speedBtn, volume === v && styles.speedBtnActive]}
                        onPress={() => setVolume(v)}
                      >
                        <Text style={[styles.speedBtnText, volume === v && styles.speedBtnTextActive]}>
                          {v}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.audioBtns}>
                  {[
                    { icon: '🎵', label: 'Musique'  },
                    { icon: '🎤', label: 'Voix Off' },
                    { icon: '🔇', label: 'Muet'     },
                  ].map((btn) => (
                    <TouchableOpacity key={btn.label} style={styles.audioBtn}>
                      <Text style={styles.audioBtnIcon}>{btn.icon}</Text>
                      <Text style={styles.audioBtnLabel}>{btn.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── FILTRE ── */}
            {activeTool === 'filter' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>🎨 Filtres Cinématographiques</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {FILTERS.map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      style={[
                        styles.filterChip,
                        selectedFilter === f.id && styles.filterChipActive,
                        { borderColor: f.color },
                      ]}
                      onPress={() => setSelectedFilter(f.id)}
                    >
                      <View style={[styles.filterDot, { backgroundColor: f.color }]} />
                      <Text style={[
                        styles.filterLabel,
                        selectedFilter === f.id && { color: f.color },
                      ]}>
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── EFFETS ── */}
            {activeTool === 'effect' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>✨ Effets Visuels</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {EFFECTS.map((e) => (
                    <TouchableOpacity
                      key={e.id}
                      style={styles.effectCard}
                      onPress={() => e.isPro && !isPro ? showPaywall() : Alert.alert(e.label, 'Appliqué !')}
                    >
                      {e.isPro && !isPro && (
                        <View style={styles.proLock}>
                          <Text style={styles.proLockText}>PRO</Text>
                        </View>
                      )}
                      <Text style={styles.effectIcon}>{e.icon}</Text>
                      <Text style={styles.effectLabel}>{e.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── TRANSITION ── */}
            {activeTool === 'transition' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>▷▷ Transitions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {TRANSITIONS.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={[
                        styles.filterChip,
                        selectedTransition === t.id && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedTransition(t.id)}
                    >
                      <Text style={styles.filterLabel}>{t.icon} {t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── COMPRESSER ── */}
            {activeTool === 'compress' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>📦 Compresseur HD</Text>
                <Text style={styles.panelDesc}>
                  Réduction du poids · Résolution 1080p maintenue
                </Text>
                <View style={styles.speedBtns}>
                  {['720p', '1080p', '4K'].map((q) => (
                    <TouchableOpacity key={q} style={styles.speedBtn}>
                      <Text style={styles.speedBtnText}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── CONVERTIR ── */}
            {activeTool === 'convert' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>🔄 Convertisseur</Text>
                <View style={styles.speedBtns}>
                  {['MOV→MP4', 'AVI→MP4', '3GP→MP4'].map((c) => (
                    <TouchableOpacity key={c} style={styles.speedBtn}>
                      <Text style={styles.speedBtnText}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── TEXTE ── */}
            {activeTool === 'text' && (
              <View style={styles.panelContent}>
                <Text style={styles.panelTitle}>T  Ajouter du texte</Text>
                <Text style={styles.panelDesc}>
                  Appuyez sur la prévisualisation pour ajouter du texte
                </Text>
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
            <Text style={styles.exportTitle}>Exporter & Partager</Text>
            <Text style={styles.exportSub}>Résolution 1080p · Format MP4</Text>

            <View style={styles.exportOptions}>
              {[
                { icon: '💾', label: 'Enregistrer' },
                { icon: '📸', label: 'Instagram'   },
                { icon: '📘', label: 'Facebook'    },
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
            </View>

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
  headerTitle: {
    color: COLORS.text,
    fontSize: rs(16),
    fontWeight: '700',
  },
  exportHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(16),
    paddingVertical: rs(8),
    borderRadius: rs(20),
  },
  exportHeaderText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: rs(13),
  },

  // Preview
  preview: {
    height: height * 0.28,
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
  previewEmoji: { fontSize: rs(52) },
  previewLabel: {
    color: COLORS.textMuted,
    fontSize: rs(13),
    marginTop: rs(8),
  },
  timecode: {
    position: 'absolute',
    top: rs(10),
    right: rs(12),
  },
  timecodeText: {
    color: COLORS.textMuted,
    fontSize: rs(11),
    fontFamily: 'monospace',
  },
  playControls: {
    position: 'absolute',
    bottom: rs(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(32),
  },
  playControlBtn: { padding: rs(4) },
  playControlIcon: { color: COLORS.textGray, fontSize: rs(20) },
  playMainBtn: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(24),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playMainIcon: { color: COLORS.text, fontSize: rs(20) },

  // Timeline
  timeline: {
    height: rs(72),
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
  },
  timelineContent: {
    paddingHorizontal: rs(40),
    paddingVertical: rs(8),
    flexDirection: 'column',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackIcon: { fontSize: rs(12), marginRight: rs(6), width: rs(20) },
  clip: {
    height: rs(28),
    borderRadius: rs(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clipText: {
    color: COLORS.text,
    fontSize: rs(11),
    fontWeight: '600',
  },
  playhead: {
    position: 'absolute',
    top: 0,
    left: '35%',
    width: rs(2),
    height: '100%',
    backgroundColor: COLORS.primary,
  },

  // Toolbar
  toolBar: {
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingVertical: rs(6),
  },
  toolBarContent: {
    paddingHorizontal: rs(8),
    gap: rs(4),
  },
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
  toolBtnLabel: {
    color: COLORS.textMuted,
    fontSize: rs(10),
    textAlign: 'center',
  },
  toolBtnLabelActive: { color: COLORS.primary },

  // Panel
  panel: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  panelContent: {
    flex: 1,
    padding: rs(16),
  },
  panelTitle: {
    color: COLORS.text,
    fontSize: rs(14),
    fontWeight: '700',
    marginBottom: rs(12),
  },
  panelDesc: {
    color: COLORS.textGray,
    fontSize: rs(13),
    marginBottom: rs(12),
  },

  // Couper
  cutGrid: {
    flexDirection: 'row',
    gap: rs(10),
  },
  cutBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: rs(12),
    paddingVertical: rs(14),
    alignItems: 'center',
    gap: rs(6),
  },
  cutBtnIcon: { fontSize: rs(22) },
  cutBtnLabel: { color: COLORS.textGray, fontSize: rs(11) },

  // Vitesse
  speedBtns: {
    flexDirection: 'row',
    gap: rs(10),
    flexWrap: 'wrap',
  },
  speedBtn: {
    paddingHorizontal: rs(16),
    paddingVertical: rs(10),
    borderRadius: rs(10),
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  speedBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  speedBtnText: { color: COLORS.textGray, fontWeight: '700', fontSize: rs(13) },
  speedBtnTextActive: { color: COLORS.text },

  // Audio
  audioRow: { marginBottom: rs(12) },
  audioLabel: { color: COLORS.textGray, fontSize: rs(13), marginBottom: rs(8) },
  volumeBar: {
    height: rs(6),
    backgroundColor: COLORS.bgLight,
    borderRadius: rs(3),
    overflow: 'hidden',
    marginBottom: rs(10),
  },
  volumeFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: rs(3),
  },
  audioPresets: { flexDirection: 'row', gap: rs(8) },
  audioBtns: {
    flexDirection: 'row',
    gap: rs(10),
  },
  audioBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: rs(12),
    paddingVertical: rs(12),
    alignItems: 'center',
    gap: rs(6),
  },
  audioBtnIcon: { fontSize: rs(24) },
  audioBtnLabel: { color: COLORS.textGray, fontSize: rs(11) },

  // Filtres
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rs(14),
    paddingVertical: rs(8),
    borderRadius: rs(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginRight: rs(8),
    gap: rs(6),
  },
  filterChipActive: { backgroundColor: 'rgba(232,41,76,0.15)' },
  filterDot: { width: rs(10), height: rs(10), borderRadius: rs(5) },
  filterLabel: { color: COLORS.textGray, fontSize: rs(13) },

  // Effets
  effectCard: {
    alignItems: 'center',
    marginRight: rs(16),
    position: 'relative',
  },
  proLock: {
    position: 'absolute',
    top: -rs(4),
    right: -rs(4),
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(4),
    paddingVertical: rs(1),
    borderRadius: rs(4),
    zIndex: 1,
  },
  proLockText: { color: COLORS.text, fontSize: rs(8), fontWeight: '800' },
  effectIcon: { fontSize: rs(30) },
  effectLabel: { color: COLORS.textGray, fontSize: rs(11), marginTop: rs(4) },

  // Export modal
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
    marginBottom: rs(4),
  },
  exportSub: {
    color: COLORS.textMuted,
    fontSize: rs(13),
    textAlign: 'center',
    marginBottom: rs(24),
  },
  exportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: rs(24),
  },
  exportOpt: { alignItems: 'center', gap: rs(8) },
  exportOptIcon: { fontSize: rs(38) },
  exportOptLabel: { color: COLORS.textGray, fontSize: rs(12) },
  exportCancel: {
    backgroundColor: COLORS.bgLight,
    borderRadius: rs(14),
    padding: rs(14),
    alignItems: 'center',
  },
  exportCancelText: { color: COLORS.text, fontWeight: '600', fontSize: rs(15) },
});
