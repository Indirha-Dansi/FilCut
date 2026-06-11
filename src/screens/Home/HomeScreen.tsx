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
  Modal,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── RESPONSIVE ──────────────────────────────────────────────────────────────
const scale = width / 375; // base 375px (iPhone standard)
const rs = (size: number) => Math.round(size * scale);

const COLORS = {
  primary:    '#E8294C',
  secondary:  '#8A2BE2',
  accent:     '#FF6B35',
  gold:       '#FFB800',
  bgLight:    '#FFF8F2',
  bgCard:     '#FFFFFF',
  bgOrange:   '#FFE4CC',
  text:       '#1A1A1A',
  textGray:   '#888888',
  textLight:  '#BBBBBB',
  white:      '#FFFFFF',
};

// Sous-menu Collage — calqué sur image 5
const COLLAGE_MODES = [
  { id: 'grille',    label: 'Grille',      icon: '▦', isPro: false },
  { id: 'libre',     label: 'Style libre', icon: '◫', isPro: false },
  { id: 'ia',        label: 'IA Mélange',  icon: '⊞', isPro: true  },
  { id: 'assembler', label: 'Assembler',   icon: '☰', isPro: false },
];

// Cartes tendances
const FEATURED = [
  { id: '1', label: 'CHEVAL\nCHANCEUX', emoji: '🐉', bg: '#FFE8D6', textColor: '#C45200' },
  { id: '2', label: "JE\nT'AIME",       emoji: '💕', bg: '#FFD6E4', textColor: '#C4004E' },
  { id: '3', label: 'NOUVEAUTÉS\n& EN VEDETTE', emoji: '⭐', bg: '#FFF0CC', textColor: '#B07800', isPro: true },
];

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  const [collageVisible, setCollageVisible] = useState(false);
  const isPro = false;

  const showPaywall = () => {
    Alert.alert(
      '⭐ FilCut Pro',
      "Pour 4,99€, libérez la puissance de l'IA !\n\n✨ Légendes IA automatiques\n🎨 Styles IA Lab\n♾️ Sans publicité",
      [
        { text: 'Peut-être plus tard', style: 'cancel' },
        { text: 'Débloquer Pro — 4,99€', onPress: () => {} },
      ],
    );
  };

  const handleCollageMode = (mode: typeof COLLAGE_MODES[0]) => {
    setCollageVisible(false);
    if (mode.isPro && !isPro) { showPaywall(); return; }
    navigation.navigate('MediaPicker', { mode: 'collage', collageMode: mode.id });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* ══════════ HEADER ══════════ */}
          <View style={styles.header}>
            {/* Logo FilCut */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIconBox}>
                <Text style={styles.logoIconText}>✂</Text>
              </View>
              <Text style={styles.logoText}>
                <Text style={styles.logoFil}>Fil</Text>
                <Text style={styles.logoCut}>Cut</Text>
              </Text>
            </View>

            {/* Actions header */}
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn} onPress={showPaywall}>
                <Text style={styles.headerBtnIcon}>♛</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={() => navigation.navigate('Settings')}
              >
                <Text style={styles.headerBtnIcon}>⚙</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {/* ══════════ SECTION CRÉER NOUVEAU ══════════ */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>CRÉER NOUVEAU</Text>

              <View style={styles.createCard}>
                {/* Vidéo */}
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => navigation.navigate('MediaPicker', { mode: 'video' })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.createCircle, { backgroundColor: COLORS.primary }]}>
                    <Text style={styles.createIcon}>▶</Text>
                  </View>
                  <Text style={styles.createLabel}>Vidéo</Text>
                </TouchableOpacity>

                {/* Photo */}
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => navigation.navigate('MediaPicker', { mode: 'photo' })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.createCircle, { backgroundColor: COLORS.accent }]}>
                    <Text style={styles.createIcon}>🖼</Text>
                  </View>
                  <Text style={styles.createLabel}>Photo</Text>
                </TouchableOpacity>

                {/* Collage */}
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => setCollageVisible(true)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.createCircle, { backgroundColor: COLORS.gold }]}>
                    <Text style={styles.createIcon}>⊡</Text>
                  </View>
                  <Text style={styles.createLabel}>Collage</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ══════════ SECTION NOUVELLE FONCTIONNALITÉ ══════════ */}
            <View style={styles.featuredContainer}>
              <View style={styles.featuredTitleRow}>
                <Text style={styles.sectionLabel}>NOUVELLE FONCTIONNALITÉ</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>TOUT ›</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredScroll}
              >
                {FEATURED.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.featuredCard, { backgroundColor: item.bg }]}
                    onPress={() => item.isPro && !isPro ? showPaywall() : null}
                    activeOpacity={0.85}
                  >
                    {item.isPro && !isPro && (
                      <View style={styles.proTag}>
                        <Text style={styles.proTagText}>PRO ✦</Text>
                      </View>
                    )}
                    <Text style={styles.featuredEmoji}>{item.emoji}</Text>
                    <Text style={[styles.featuredLabel, { color: item.textColor }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* ══════════ BANNIÈRE PRO ══════════ */}
            <TouchableOpacity
              style={styles.promoBanner}
              onPress={showPaywall}
              activeOpacity={0.9}
            >
              <View style={styles.promoBannerLeft}>
                <Text style={styles.promoCrown}>♛</Text>
                <View>
                  <Text style={styles.promoTitle}>FilCut Pro</Text>
                  <Text style={styles.promoSub}>IA · Effets · Sans pub</Text>
                </View>
              </View>
              <View style={styles.promoPriceBox}>
                <Text style={styles.promoPrice}>4,99€</Text>
                <Text style={styles.promoUnlock}>Débloquer →</Text>
              </View>
            </TouchableOpacity>

            {/* ══════════ OUTILS RAPIDES ══════════ */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>OUTILS RAPIDES</Text>
              <View style={styles.toolsGrid}>
                {[
                  { icon: '⚡', label: 'Vitesse',    color: '#FF6B35' },
                  { icon: '🎵', label: 'Audio',      color: '#8A2BE2' },
                  { icon: '✨', label: 'Effets',     color: '#E8294C' },
                  { icon: '📦', label: 'Compresser', color: '#22C55E' },
                ].map((tool) => (
                  <TouchableOpacity
                    key={tool.label}
                    style={styles.toolCard}
                    onPress={() => navigation.navigate('MediaPicker', { mode: 'video' })}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
                      <Text style={styles.toolIconText}>{tool.icon}</Text>
                    </View>
                    <Text style={styles.toolLabel}>{tool.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: rs(20) }} />
          </ScrollView>

          {/* ══════════ MODAL COLLAGE ══════════ */}
          <Modal
            visible={collageVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setCollageVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setCollageVisible(false)}
            >
              <View style={styles.collageSheet}>
                <View style={styles.collageHandle} />
                <Text style={styles.collageTitle}>Choisir un style</Text>

                {COLLAGE_MODES.map((mode, index) => (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.collageRow,
                      index === 0 && styles.collageRowActive,
                    ]}
                    onPress={() => handleCollageMode(mode)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.collageRowLabel,
                      index === 0 && styles.collageRowLabelActive,
                    ]}>
                      {mode.label}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {mode.isPro && (
                        <View style={styles.miniProTag}>
                          <Text style={styles.miniProText}>PRO</Text>
                        </View>
                      )}
                      <Text style={[
                        styles.collageRowIcon,
                        index === 0 && { color: COLORS.white },
                      ]}>
                        {mode.icon}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.collageCancel}
                  onPress={() => setCollageVisible(false)}
                >
                  <Text style={styles.collageCancelText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

        </View>
      </SafeAreaView>
    </>
  );
}

// ─── TAILLE DES CERCLES responsive ───────────────────────────────────────────
const CIRCLE_SIZE = Math.round((width - rs(48) * 2 - rs(16) * 2) / 3);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(20),
    paddingTop: rs(12),
    paddingBottom: rs(12),
    backgroundColor: COLORS.bgLight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
  },
  logoIconBox: {
    width: rs(36),
    height: rs(36),
    borderRadius: rs(10),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    color: COLORS.white,
    fontSize: rs(18),
    fontWeight: '800',
  },
  logoText: {
    fontSize: rs(22),
  },
  logoFil: {
    color: COLORS.text,
    fontWeight: '300',
  },
  logoCut: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    gap: rs(8),
  },
  headerBtn: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(19),
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnIcon: {
    fontSize: rs(18),
    color: COLORS.text,
  },

  // ── Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: rs(20),
  },

  // ── Section
  sectionBox: {
    paddingHorizontal: rs(20),
    marginTop: rs(20),
  },
  sectionLabel: {
    color: COLORS.textGray,
    fontSize: rs(11),
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: rs(12),
  },

  // ── Créer card
  createCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: rs(20),
    paddingVertical: rs(20),
    paddingHorizontal: rs(16),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  createBtn: {
    alignItems: 'center',
    gap: rs(8),
  },
  createCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIcon: {
    fontSize: rs(28),
    color: COLORS.white,
  },
  createLabel: {
    color: COLORS.text,
    fontSize: rs(13),
    fontWeight: '600',
  },

  // ── Featured
  featuredContainer: {
    marginTop: rs(24),
  },
  featuredTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rs(20),
    marginBottom: rs(12),
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: rs(12),
    fontWeight: '700',
  },
  featuredScroll: {
    paddingHorizontal: rs(20),
    gap: rs(12),
  },
  featuredCard: {
    width: rs(120),
    height: rs(130),
    borderRadius: rs(16),
    alignItems: 'center',
    justifyContent: 'center',
    padding: rs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredEmoji: {
    fontSize: rs(38),
    marginBottom: rs(8),
  },
  featuredLabel: {
    fontSize: rs(11),
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: rs(15),
  },
  proTag: {
    position: 'absolute',
    top: rs(8),
    right: rs(8),
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: rs(5),
    paddingVertical: rs(2),
    borderRadius: rs(4),
  },
  proTagText: {
    color: '#7A5000',
    fontSize: rs(9),
    fontWeight: '800',
  },

  // ── Promo banner
  promoBanner: {
    marginHorizontal: rs(20),
    marginTop: rs(24),
    borderRadius: rs(16),
    backgroundColor: COLORS.secondary,
    padding: rs(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  promoBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(12),
  },
  promoCrown: {
    fontSize: rs(30),
    color: COLORS.gold,
  },
  promoTitle: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: rs(16),
  },
  promoSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: rs(12),
    marginTop: rs(2),
  },
  promoPriceBox: {
    alignItems: 'flex-end',
  },
  promoPrice: {
    color: COLORS.gold,
    fontWeight: '900',
    fontSize: rs(20),
  },
  promoUnlock: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: rs(11),
    marginTop: rs(2),
  },

  // ── Outils rapides
  toolsGrid: {
    flexDirection: 'row',
    gap: rs(12),
  },
  toolCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: rs(14),
    paddingVertical: rs(14),
    alignItems: 'center',
    gap: rs(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  toolIcon: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIconText: {
    fontSize: rs(20),
  },
  toolLabel: {
    color: COLORS.text,
    fontSize: rs(11),
    fontWeight: '600',
  },

  // ── Modal collage
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  collageSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: rs(24),
    borderTopRightRadius: rs(24),
    paddingBottom: rs(34),
    paddingTop: rs(12),
  },
  collageHandle: {
    width: rs(40),
    height: rs(4),
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: rs(2),
    alignSelf: 'center',
    marginBottom: rs(16),
  },
  collageTitle: {
    color: COLORS.text,
    fontSize: rs(16),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: rs(12),
  },
  collageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(24),
    paddingVertical: rs(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  collageRowActive: {
    backgroundColor: '#00C896',
  },
  collageRowLabel: {
    fontSize: rs(16),
    fontWeight: '600',
    color: COLORS.text,
  },
  collageRowLabelActive: {
    color: COLORS.white,
  },
  collageRowIcon: {
    fontSize: rs(22),
    color: COLORS.textGray,
  },
  miniProTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: rs(5),
    paddingVertical: rs(2),
    borderRadius: rs(4),
  },
  miniProText: {
    color: COLORS.white,
    fontSize: rs(9),
    fontWeight: '800',
  },
  collageCancel: {
    marginTop: rs(8),
    marginHorizontal: rs(24),
    paddingVertical: rs(14),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: rs(12),
    alignItems: 'center',
  },
  collageCancelText: {
    color: COLORS.text,
    fontSize: rs(15),
    fontWeight: '600',
  },
});
