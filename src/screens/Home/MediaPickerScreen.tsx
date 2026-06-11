import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');
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

// ── Médias simulés (en production → CameraRoll) ───────────────────────────
const MOCK_MEDIA = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  type: i % 5 === 0 ? 'video' : 'photo',
  duration: i % 5 === 0
    ? `0:${String(Math.floor(Math.random() * 55) + 5).padStart(2, '0')}`
    : null,
  color: [
    '#E8294C', '#8A2BE2', '#FF6B35', '#22C55E',
    '#3B82F6', '#F59E0B', '#EC4899', '#06B6D4',
  ][i % 8],
  emoji: i % 5 === 0 ? '🎬' : ['🌅', '🏙', '🌿', '😊', '🎨'][i % 5],
}));

interface Props {
  navigation: any;
  route: {
    params: {
      mode: 'video' | 'photo' | 'collage';
      collageMode?: string;
    };
  };
}

export default function MediaPickerScreen({ navigation, route }: Props) {
  const { mode, collageMode } = route.params;
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  // Limite de sélection selon le mode
  const maxSelect = mode === 'collage' ? 9 : mode === 'video' ? 10 : 1;

  // Labels
  const modeLabel: Record<string, string> = {
    video:   'Vidéo',
    photo:   'Photo',
    collage: 'Collage',
  };

  // ── Sélection ─────────────────────────────────────────────────────────────
  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= maxSelect) {
        Alert.alert(
          'Limite atteinte',
          `Maximum ${maxSelect} élément(s) pour ce mode.`,
        );
        return;
      }
      setSelected([...selected, id]);
    }
  };

  // ── Confirmer la sélection ─────────────────────────────────────────────────
  const handleConfirm = () => {
    if (selected.length === 0) {
      Alert.alert('Aucune sélection', 'Sélectionnez au moins un fichier.');
      return;
    }
    if (mode === 'video') {
      navigation.navigate('VideoEditor');
    } else if (mode === 'photo') {
      navigation.navigate('PhotoEditor');
    } else {
      navigation.navigate('CollageEditor', { collageMode });
    }
  };

  // ── Filtrage ───────────────────────────────────────────────────────────────
  const filteredMedia = MOCK_MEDIA.filter((m) => {
    if (filter === 'all') return true;
    return m.type === filter;
  });

  // ── Rendu d'une cellule ────────────────────────────────────────────────────
  const THUMB = (width - 3) / 3;

  const renderItem = ({ item }: { item: typeof MOCK_MEDIA[0] }) => {
    const idx = selected.indexOf(item.id);
    const isSelected = idx !== -1;

    return (
      <TouchableOpacity
        style={[styles.thumb, { width: THUMB, height: THUMB }]}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.8}
      >
        {/* Aperçu coloré simulé */}
        <View style={[styles.thumbBg, { backgroundColor: item.color }]}>
          <Text style={styles.thumbEmoji}>{item.emoji}</Text>
          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}
        </View>

        {/* Overlay sélectionné */}
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedNumber}>{idx + 1}</Text>
            </View>
          </View>
        )}

        {/* Cercle vide non sélectionné */}
        {!isSelected && <View style={styles.unselectedCircle} />}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* ══════════ HEADER ══════════ */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>
                {modeLabel[mode]}
              </Text>
              <Text style={styles.headerSub}>
                {selected.length > 0
                  ? `${selected.length} / ${maxSelect} sélectionné(s)`
                  : `Max ${maxSelect} fichier(s)`}
              </Text>
            </View>

            {/* Bouton Suivant */}
            {selected.length > 0 ? (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleConfirm}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>
                  Suivant ({selected.length})
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: rs(80) }} />
            )}
          </View>

          {/* ══════════ FILTRES ══════════ */}
          <View style={styles.filterBar}>
            {(['all', 'photo', 'video'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterBtn,
                  filter === f && styles.filterBtnActive,
                ]}
                onPress={() => setFilter(f)}
              >
                <Text style={[
                  styles.filterBtnText,
                  filter === f && styles.filterBtnTextActive,
                ]}>
                  {f === 'all' ? 'Tout' : f === 'photo' ? '📷 Photos' : '🎬 Vidéos'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ══════════ GRILLE MÉDIAS ══════════ */}
          <FlatList
            data={filteredMedia}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={renderItem}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1.5 }} />}
          />

          {/* ══════════ BARRE FLOTTANTE ══════════ */}
          {selected.length > 0 && (
            <View style={styles.floatingBar}>
              <TouchableOpacity
                onPress={() => setSelected([])}
                style={styles.clearBtn}
              >
                <Text style={styles.clearBtnText}>Tout effacer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
                activeOpacity={0.9}
              >
                <Text style={styles.confirmBtnText}>
                  Confirmer  →
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(16),
    paddingVertical: rs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  cancelBtn: {
    width: rs(36),
    height: rs(36),
    borderRadius: rs(18),
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: COLORS.text,
    fontSize: rs(16),
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: rs(8),
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: rs(16),
    fontWeight: '700',
  },
  headerSub: {
    color: COLORS.textMuted,
    fontSize: rs(12),
    marginTop: rs(2),
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(14),
    paddingVertical: rs(8),
    borderRadius: rs(20),
    width: rs(80),
    alignItems: 'center',
  },
  nextBtnText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: rs(12),
  },

  // Filtres
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: rs(16),
    paddingVertical: rs(10),
    gap: rs(8),
    backgroundColor: COLORS.bgDark,
  },
  filterBtn: {
    paddingHorizontal: rs(16),
    paddingVertical: rs(6),
    borderRadius: rs(20),
    backgroundColor: COLORS.bgCard,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterBtnText: {
    color: COLORS.textMuted,
    fontSize: rs(13),
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: COLORS.text,
  },

  // Grille
  grid: {
    gap: 1.5,
  },
  thumb: {
    marginRight: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: {
    fontSize: rs(32),
  },
  durationBadge: {
    position: 'absolute',
    bottom: rs(4),
    right: rs(4),
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: rs(5),
    paddingVertical: rs(2),
    borderRadius: rs(4),
  },
  durationText: {
    color: COLORS.text,
    fontSize: rs(10),
    fontWeight: '700',
  },
 selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(232,41,76,0.35)',
  },
  selectedBadge: {
    position: 'absolute',
    top: rs(6),
    right: rs(6),
    width: rs(24),
    height: rs(24),
    borderRadius: rs(12),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  selectedNumber: {
    color: COLORS.text,
    fontSize: rs(12),
    fontWeight: '800',
  },
  unselectedCircle: {
    position: 'absolute',
    top: rs(6),
    right: rs(6),
    width: rs(24),
    height: rs(24),
    borderRadius: rs(12),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },

  // Barre flottante
  floatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(20),
    paddingVertical: rs(14),
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: rs(28),
  },
  clearBtn: {
    paddingVertical: rs(10),
  },
  clearBtnText: {
    color: COLORS.textGray,
    fontSize: rs(14),
    fontWeight: '500',
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(28),
    paddingVertical: rs(12),
    borderRadius: rs(24),
  },
  confirmBtnText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: rs(15),
  },
});
