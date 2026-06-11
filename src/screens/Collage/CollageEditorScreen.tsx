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
};

const LAYOUTS = [
  { id: '1',   label: '1',    cols: 1, rows: 1, cells: 1 },
  { id: '1+1', label: '1+1',  cols: 2, rows: 1, cells: 2 },
  { id: '2x2', label: '2×2',  cols: 2, rows: 2, cells: 4 },
  { id: '1+2', label: '1+2',  cols: 2, rows: 2, cells: 3 },
  { id: '3',   label: '3col', cols: 3, rows: 1, cells: 3 },
  { id: '3x3', label: '3×3',  cols: 3, rows: 3, cells: 9 },
];

const FILTERS = [
  { id: 'none',    label: 'Aucun',   color: COLORS.textMuted },
  { id: 'warm',    label: 'Chaud',   color: '#FF8C42' },
  { id: 'cool',    label: 'Froid',   color: '#3B82F6' },
  { id: 'bw',      label: 'N&B',     color: '#888' },
  { id: 'vintage', label: 'Vintage', color: '#C8A26D' },
];

const BG_COLORS = ['#000', '#fff', '#1a1a1a', '#E8294C', '#8A2BE2', '#FF6B35'];

const CELL_COLORS = [
  '#E8294C', '#8A2BE2', '#FF6B35', '#22C55E',
  '#3B82F6', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16',
];

interface Props {
  navigation: any;
  route: { params?: { collageMode?: string } };
}

export default function CollageEditorScreen({ navigation, route }: Props) {
  const [layout, setLayout]           = useState(LAYOUTS[2]);
  const [spacing, setSpacing]         = useState(4);
  const [radius, setRadius]           = useState(8);
  const [bg, setBg]                   = useState('#000');
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [cellFilters, setCellFilters]   = useState<Record<number, string>>({});
  const [showExport, setShowExport]     = useState(false);

  const setFilterForCell = (filterId: string) => {
    if (selectedCell === null) return;
    setCellFilters((prev) => ({ ...prev, [selectedCell]: filterId }));
  };

  // ── Grille de prévisualisation ─────────────────────────────────────────────
  const PREVIEW_SIZE = width - rs(40);
  const cellSize = (PREVIEW_SIZE - spacing * (layout.cols - 1)) / layout.cols;

  const renderGrid = () => {
    const rows = [];
    let cellIdx = 0;
    for (let r = 0; r < layout.rows; r++) {
      const cols = [];
      for (let c = 0; c < layout.cols; c++) {
        if (cellIdx >= layout.cells) break;
        const idx = cellIdx;
        const isSelected = selectedCell === idx;
        cols.push(
          <TouchableOpacity
            key={c}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                backgroundColor: CELL_COLORS[idx % CELL_COLORS.length],
                borderRadius: radius,
                marginRight: c < layout.cols - 1 ? spacing : 0,
                borderWidth: isSelected ? 3 : 0,
                borderColor: '#fff',
              },
            ]}
            onPress={() => setSelectedCell(isSelected ? null : idx)}
          >
            <Text style={styles.cellEmoji}>
              {isSelected ? '✓' : '+'}
            </Text>
          </TouchableOpacity>
        );
        cellIdx++;
      }
      rows.push(
        <View
          key={r}
          style={[styles.gridRow, { marginBottom: r < layout.rows - 1 ? spacing : 0 }]}
        >
          {cols}
        </View>
      );
    }
    return rows;
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
            <Text style={styles.headerTitle}>Éditeur Collage</Text>
            <TouchableOpacity
              style={styles.exportHeaderBtn}
              onPress={() => setShowExport(true)}
            >
              <Text style={styles.exportHeaderText}>Exporter</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* ══════════ GRILLE PREVIEW ══════════ */}
            <View style={styles.previewContainer}>
              <View style={[styles.gridPreview, { backgroundColor: bg, width: PREVIEW_SIZE }]}>
                {renderGrid()}
              </View>
            </View>

            {/* ══════════ LAYOUTS ══════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mise en page</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: rs(10) }}
              >
                {LAYOUTS.map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    style={[
                      styles.layoutBtn,
                      layout.id === l.id && styles.layoutBtnActive,
                    ]}
                    onPress={() => setLayout(l)}
                  >
                    <Text style={[
                      styles.layoutBtnText,
                      layout.id === l.id && styles.layoutBtnTextActive,
                    ]}>
                      {l.label}
                    </Text>
                    <Text style={styles.layoutCells}>{l.cells} photo{l.cells > 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* ══════════ ESPACEMENT ══════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Espacement</Text>
              <View style={styles.optionRow}>
                {[0, 2, 4, 8, 12].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.optionBtn, spacing === s && styles.optionBtnActive]}
                    onPress={() => setSpacing(s)}
                  >
                    <Text style={[styles.optionBtnText, spacing === s && styles.optionBtnTextActive]}>
                      {s}px
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ══════════ COINS ARRONDIS ══════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Coins arrondis</Text>
              <View style={styles.optionRow}>
                {[0, 4, 8, 16, 24].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.optionBtn, radius === r && styles.optionBtnActive]}
                    onPress={() => setRadius(r)}
                  >
                    <Text style={[styles.optionBtnText, radius === r && styles.optionBtnTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ══════════ COULEUR DE FOND ══════════ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fond</Text>
              <View style={styles.bgRow}>
                {BG_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.bgDot,
                      { backgroundColor: c },
                      bg === c && styles.bgDotActive,
                    ]}
                    onPress={() => setBg(c)}
                  >
                    {bg === c && <Text style={styles.bgCheck}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ══════════ FILTRE PAR CELLULE ══════════ */}
            {selectedCell !== null && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Filtre — Cellule {selectedCell + 1}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: rs(10) }}
                >
                  {FILTERS.map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      style={[
                        styles.filterChip,
                        cellFilters[selectedCell] === f.id && styles.filterChipActive,
                      ]}
                      onPress={() => setFilterForCell(f.id)}
                    >
                      <View style={[styles.filterDot, { backgroundColor: f.color }]} />
                      <Text style={styles.filterLabel}>{f.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={{ height: rs(40) }} />
          </ScrollView>

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
            <Text style={styles.exportTitle}>Exporter le Collage</Text>
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
    width: rs(36), height: rs(36), borderRadius: rs(18),
    backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: COLORS.text, fontSize: rs(16) },
  headerTitle: { color: COLORS.text, fontSize: rs(16), fontWeight: '700' },
  exportHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(16), paddingVertical: rs(8), borderRadius: rs(20),
  },
  exportHeaderText: { color: COLORS.text, fontWeight: '700', fontSize: rs(13) },

  previewContainer: {
    alignItems: 'center',
    paddingVertical: rs(20),
  },
  gridPreview: {
    borderRadius: rs(12),
    padding: rs(4),
    overflow: 'hidden',
  },
  gridRow: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cellEmoji: { color: 'rgba(255,255,255,0.7)', fontSize: rs(22), fontWeight: '300' },

  section: { paddingHorizontal: rs(20), marginBottom: rs(20) },
  sectionTitle: {
    color: COLORS.text, fontSize: rs(14), fontWeight: '700', marginBottom: rs(12),
  },

  optionRow: { flexDirection: 'row', gap: rs(8) },
  optionBtn: {
    paddingHorizontal: rs(14), paddingVertical: rs(10),
    borderRadius: rs(10), backgroundColor: COLORS.bgCard,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  optionBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionBtnText: { color: COLORS.textGray, fontWeight: '600', fontSize: rs(13) },
  optionBtnTextActive: { color: COLORS.text },

  layoutBtn: {
    paddingHorizontal: rs(14), paddingVertical: rs(10),
    borderRadius: rs(10), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', minWidth: rs(60),
  },
  layoutBtnActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(232,41,76,0.1)' },
  layoutBtnText: { color: COLORS.textGray, fontWeight: '700', fontSize: rs(13) },
  layoutBtnTextActive: { color: COLORS.primary },
  layoutCells: { color: COLORS.textMuted, fontSize: rs(10), marginTop: rs(2) },

  bgRow: { flexDirection: 'row', gap: rs(12) },
  bgDot: {
    width: rs(36), height: rs(36), borderRadius: rs(18),
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  bgDotActive: { borderColor: '#fff' },
  bgCheck: { color: '#fff', fontSize: rs(16), fontWeight: '800' },

  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: rs(14), paddingVertical: rs(8),
    borderRadius: rs(20), borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', gap: rs(6),
  },
  filterChipActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(232,41,76,0.15)' },
  filterDot: { width: rs(10), height: rs(10), borderRadius: rs(5) },
  filterLabel: { color: COLORS.textGray, fontSize: rs(13) },

  exportOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  exportSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: rs(24), borderTopRightRadius: rs(24),
    padding: rs(24), paddingBottom: rs(40),
  },
  exportHandle: {
    width: rs(40), height: rs(4), backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: rs(2), alignSelf: 'center', marginBottom: rs(16),
  },
  exportTitle: {
    color: COLORS.text, fontSize: rs(18), fontWeight: '800',
    textAlign: 'center', marginBottom: rs(20),
  },
  exportOpt: {
    flexDirection: 'row', alignItems: 'center', gap: rs(14),
    paddingVertical: rs(14), borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  exportOptIcon: { fontSize: rs(28) },
  exportOptLabel: { color: COLORS.text, fontSize: rs(15) },
  exportCancel: {
    marginTop: rs(16), backgroundColor: COLORS.bgLight,
    borderRadius: rs(14), padding: rs(14), alignItems: 'center',
  },
  exportCancelText: { color: COLORS.text, fontWeight: '600', fontSize: rs(15) },
});
