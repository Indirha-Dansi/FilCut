import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';

const scale = 1;
const rs = (size: number) => Math.round(size * scale);

const COLORS = {
  primary:    '#E8294C',
  primaryDark:'#C01E3A',
  bgLight:    '#FFFFFF',
  bgSection:  '#F8F8F8',
  text:       '#1A1A1A',
  textGray:   '#888888',
  border:     'rgba(0,0,0,0.07)',
};

interface RowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

const Row = ({ icon, label, subtitle, onPress, showArrow = true, danger = false }: RowProps) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
    <View style={[styles.rowIconBox, danger && { backgroundColor: 'rgba(232,41,76,0.1)' }]}>
      <Text style={styles.rowIconText}>{icon}</Text>
    </View>
    <View style={styles.rowContent}>
      <Text style={[styles.rowLabel, danger && { color: COLORS.primary }]}>{label}</Text>
      {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
    </View>
    {showArrow && <Text style={styles.rowArrow}>›</Text>}
  </TouchableOpacity>
);

interface Props {
  navigation: any;
}

export default function SettingsScreen({ navigation }: Props) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
        <View style={styles.container}>

          {/* ══════════ HEADER ROUGE ══════════ */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Réglages</Text>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >

            {/* ══════════ SECTION PRINCIPALE ══════════ */}
            <Row
              icon="🏠"
              label="Thème"
              subtitle="Personnalisez votre page d'accueil"
              onPress={() => Alert.alert('Thème', 'Sombre / Clair / Système')}
            />
            <Row
              icon="✨"
              label="Nouveautés & En Vedette"
              onPress={() => {}}
            />
            <Row
              icon="💡"
              label="Trouver Des Idées"
              onPress={() => {}}
            />
            <Row
              icon="🌐"
              label="Langue"
              subtitle="Français"
              onPress={() => Alert.alert('Langue', 'Français / English / Español')}
            />
            <Row
              icon="❓"
              label="Q&A"
              onPress={() => Alert.alert('Q&A', 'Aide et questions fréquentes')}
            />
            <Row
              icon="✉️"
              label="Rétroaction"
              onPress={() => Linking.openURL('mailto:support@filcut.app')}
            />

            {/* ══════════ SECTION RÉSEAUX ══════════ */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                Suivez-nous (Obtenir plus de tutoriels)
              </Text>
            </View>

            <Row
              icon="▶️"
              label="YouTube"
              showArrow={false}
              onPress={() => Linking.openURL('https://youtube.com')}
            />
            <Row
              icon="🎵"
              label="TikTok"
              showArrow={false}
              onPress={() => Linking.openURL('https://tiktok.com')}
            />
            <Row
              icon="𝕏"
              label="X (Twitter)"
              showArrow={false}
              onPress={() => Linking.openURL('https://x.com')}
            />
            <Row
              icon="↗️"
              label="Inviter des amis"
              showArrow={false}
              onPress={() => Alert.alert('Partager', 'Lien copié !')}
            />

            {/* ══════════ SECTION AUTRES ══════════ */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Autres</Text>
            </View>

            <Row
              icon="👁"
              label="Confidentialité & Conditions"
              onPress={() => Alert.alert('Confidentialité', 'Politique de confidentialité FilCut')}
            />

            {/* ══════════ COMPTE ══════════ */}
            <TouchableOpacity
              style={styles.accountRow}
              onPress={() => navigation.navigate('Account')}
              activeOpacity={0.7}
            >
              <View style={styles.accountAvatar}>
                <Text style={styles.accountAvatarIcon}>👤</Text>
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountEmail}>Mon compte</Text>
                <Text style={styles.accountVersion}>FilCut v1.0.0</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: { padding: 4 },
  backIcon: { color: '#fff', fontSize: 22, fontWeight: '300' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },

  scroll: { flex: 1 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgLight,
    gap: 14,
  },
  rowIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(232,41,76,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconText: { fontSize: 18 },
  rowContent: { flex: 1 },
  rowLabel: { color: COLORS.text, fontSize: 15, fontWeight: '500' },
  rowSubtitle: { color: COLORS.textGray, fontSize: 12, marginTop: 2 },
  rowArrow: { color: '#CCC', fontSize: 22 },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.bgSection,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  sectionHeaderText: { color: COLORS.textGray, fontSize: 13 },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    marginTop: 8,
    backgroundColor: COLORS.bgLight,
    gap: 14,
  },
  accountAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountAvatarIcon: { fontSize: 22 },
  accountInfo: { flex: 1 },
  accountEmail: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  accountVersion: { color: COLORS.textGray, fontSize: 12, marginTop: 2 },
});
