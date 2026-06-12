import React, { useState, useEffect } from 'react';
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
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
} from 'react-native-image-picker';

const { width } = Dimensions.get('window');
const scale = width / 375;
const rs = (size: number) => Math.round(size * scale);

const COLORS = {
  primary:   '#E8294C',
  bgDark:    '#0D0D0D',
  bgCard:    '#1A1A1A',
  bgLight:   '#242424',
  text:      '#FFFFFF',
  textGray:  '#AAAAAA',
  textMuted: '#666666',
};

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
  const [selected, setSelected] = useState<Asset[]>([]);
  const [loading, setLoading]   = useState(false);

  const maxSelect = mode === 'collage' ? 9 : mode === 'video' ? 10 : 1;

  const modeLabel: Record<string, string> = {
    video:   'Vidéo',
    photo:   'Photo',
    collage: 'Collage',
  };

  // ── Ouvrir la galerie ──────────────────────────────────────────────────────
  const openGallery = async () => {
    setLoading(true);

    const options: ImageLibraryOptions = {
      mediaType: mode === 'video' ? 'video' : mode === 'photo' ? 'photo' : 'mixed',
      selectionLimit: maxSelect,
      includeBase64: false,
      quality: 1,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        setLoading(false);
        return;
      }

      if (result.errorCode) {
        Alert.alert('Erreur', result.errorMessage || 'Impossible d\'accéder à la galerie.');
        setLoading(false);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setSelected(result.assets);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir la galerie.');
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir automatiquement la galerie au démarrage
  useEffect(() => {
    openGallery();
  }, []);

  // ── Confirmer ──────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    if (selected.length === 0) {
      Alert.alert('Aucune sélection', 'Sélectionnez au moins un fichier.');
      return;
    }

    const uris = selected.map((a) => a.uri || '').filter(Boolean);

    if (mode === 'video') {
      navigation.navigate('VideoEditor', { mediaUris: uris });
    } else if (mode === 'photo') {
      navigation.navigate('PhotoEditor', { mediaUris: uris });
    } else {
      navigation.navigate('CollageEditor', { mediaUris: uris, collageMode });
    }
  };

  // ── Retirer un élément ─────────────────────────────────────────────────────
  const removeItem = (uri: string) => {
    setSelected(selected.filter((a) => a.uri !== uri));
  };

  const THUMB = (width - rs(4)) / 3;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* ══════════ HEADER ══════════ */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{modeLabel[mode]}</Text>
              <Text style={styles.headerSub}>
                {selected.length > 0
                  ? `${selected.length} / ${maxSelect} sélectionné(s)`
                  : `Max ${maxSelect} fichier(s)`}
              </Text>
            </View>

            {selected.length > 0 ? (
              <TouchableOpacity style={styles.nextBtn} onPress={handleConfirm}>
                <Text style={styles.nextBtnText}>Suivant ({selected.length})</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: rs(90) }} />
            )}
          </View>

          {/* ══════════ CONTENU ══════════ */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.primary} size="large" />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : selected.length === 0 ? (
            // ── Aucune sélection — invite à ouvrir la galerie ──
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🖼️</Text>
              <Text style={styles.emptyTitle}>Aucun fichier sélectionné</Text>
              <Text style={styles.emptySubtitle}>
                Appuyez sur le bouton ci-dessous pour ouvrir votre galerie
              </Text>
              <TouchableOpacity style={styles.openGalleryBtn} onPress={openGallery}>
                <Text style={styles.openGalleryText}>📂 Ouvrir la galerie</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // ── Grille des fichiers sélectionnés ──
            <>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedInfoText}>
                  ✅ {selected.length} fichier(s) sélectionné(s)
                </Text>
                <TouchableOpacity onPress={openGallery}>
                  <Text style={styles.changeText}>Modifier</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={selected}
                keyExtractor={(item, index) => item.uri || String(index)}
                numColumns={3}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => (
                  <View style={[styles.thumb, { width: THUMB, height: THUMB }]}>
                    {item.uri && (
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.thumbImage}
                        resizeMode="cover"
                      />
                    )}
                    {/* Badge type */}
                    {item.type?.includes('video') && (
                      <View style={styles.videoBadge}>
                        <Text style={styles.videoBadgeText}>🎬</Text>
                      </View>
                    )}
                    {/* Bouton supprimer */}
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeItem(item.uri || '')}
                    >
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}

          {/* ══════════ BARRE FLOTTANTE ══════════ */}
          {selected.length > 0 && (
            <View style={styles.floatingBar}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => setSelected([])}>
                <Text style={styles.clearBtnText}>Tout effacer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirmer  →</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </SafeAreaView>
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
    paddingVertical: rs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  cancelBtn: {
    width: rs(36), height: rs(36), borderRadius: rs(18),
    backgroundColor: COLORS.bgCard,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { color: COLORS.text, fontSize: rs(16), fontWeight: '600' },
  headerCenter: { alignItems: 'center', flex: 1, marginHorizontal: rs(8) },
  headerTitle: { color: COLORS.text, fontSize: rs(16), fontWeight: '700' },
  headerSub: { color: COLORS.textMuted, fontSize: rs(12), marginTop: rs(2) },
  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(12),
    paddingVertical: rs(8),
    borderRadius: rs(20),
    width: rs(90),
    alignItems: 'center',
  },
  nextBtnText: { color: COLORS.text, fontWeight: '700', fontSize: rs(11) },

  // Loading
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: rs(16) },
  loadingText: { color: COLORS.textMuted, fontSize: rs(14) },

  // Empty
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: rs(40) },
  emptyEmoji: { fontSize: rs(64), marginBottom: rs(16) },
  emptyTitle: { color: COLORS.text, fontSize: rs(18), fontWeight: '700', marginBottom: rs(8), textAlign: 'center' },
  emptySubtitle: { color: COLORS.textGray, fontSize: rs(14), textAlign: 'center', lineHeight: rs(20), marginBottom: rs(32) },
  openGalleryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(32),
    paddingVertical: rs(14),
    borderRadius: rs(24),
  },
  openGalleryText: { color: COLORS.text, fontWeight: '700', fontSize: rs(15) },

  // Selected info
  selectedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rs(16),
    paddingVertical: rs(10),
  },
  selectedInfoText: { color: COLORS.text, fontSize: rs(13), fontWeight: '600' },
  changeText: { color: COLORS.primary, fontSize: rs(13), fontWeight: '700' },

  // Grid
  grid: { gap: rs(2) },
  thumb: {
    marginRight: rs(2),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.bgCard,
  },
  thumbImage: { width: '100%', height: '100%' },
  videoBadge: {
    position: 'absolute',
    bottom: rs(4),
    left: rs(4),
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: rs(4),
    padding: rs(2),
  },
  videoBadgeText: { fontSize: rs(12) },
  removeBtn: {
    position: 'absolute',
    top: rs(4),
    right: rs(4),
    width: rs(22),
    height: rs(22),
    borderRadius: rs(11),
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: rs(10), fontWeight: '800' },

  // Floating bar
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
  clearBtn: { paddingVertical: rs(10) },
  clearBtnText: { color: COLORS.textGray, fontSize: rs(14) },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(28),
    paddingVertical: rs(12),
    borderRadius: rs(24),
  },
  confirmBtnText: { color: COLORS.text, fontWeight: '800', fontSize: rs(15) },
});
