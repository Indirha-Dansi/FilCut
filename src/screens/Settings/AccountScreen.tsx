import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';

const COLORS = {
  primary:    '#E8294C',
  primaryDark:'#C01E3A',
  secondary:  '#8A2BE2',
  accent:     '#FF6B35',
  gold:       '#FFB800',
  bgLight:    '#FFFFFF',
  bgSection:  '#F8F8F8',
  text:       '#1A1A1A',
  textGray:   '#888888',
  border:     'rgba(0,0,0,0.07)',
  error:      '#EF4444',
};

interface Props {
  navigation: any;
}

export default function AccountScreen({ navigation }: Props) {
  const [editMode, setEditMode]   = useState(false);
  const [email, setEmail]         = useState('utilisateur@exemple.com');
  const [newEmail, setNewEmail]   = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSaveEmail = () => {
    if (!newEmail.trim()) { setEditMode(false); return; }
    setLoading(true);
    setTimeout(() => {
      setEmail(newEmail.trim());
      setEditMode(false);
      setLoading(false);
      Alert.alert('✅', 'Email mis à jour !');
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Supprimer mon compte',
      'Cette action est irréversible. Toutes vos données seront effacées.\n\nRemarque : La suppression de votre compte n\'annulera pas votre abonnement. Gérez-le sur Google Play Store.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer définitivement',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ],
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
        <View style={styles.container}>

          {/* ══════════ HEADER ══════════ */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gestion de compte</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* ══════════ AVATAR + EMAIL ══════════ */}
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>

              {editMode ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.emailInput}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholder={email}
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveEmail}
                    disabled={loading}
                  >
                    {loading
                      ? <ActivityIndicator color="#fff" size="small" />
                      : <Text style={styles.saveBtnText}>✓</Text>
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelEditBtn}
                    onPress={() => setEditMode(false)}
                  >
                    <Text style={styles.cancelEditText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => { setNewEmail(email); setEditMode(true); }}>
                  <Text style={styles.emailText}>{email}</Text>
                  <Text style={styles.editHint}>Appuyez pour modifier</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ══════════ BANNIÈRE PRO ══════════ */}
            <TouchableOpacity
              style={styles.proBanner}
              onPress={() => Alert.alert('FilCut Pro', 'Pour 4,99€, débloquez tout !')}
              activeOpacity={0.9}
            >
              <View style={styles.proBannerInner}>
                <Text style={styles.proCrown}>♛</Text>
                <Text style={styles.proBannerText}>Rejoindre FilCut Pro</Text>
                <Text style={styles.proArrow}>›</Text>
              </View>
            </TouchableOpacity>

            {/* ══════════ ACTIONS ══════════ */}
            <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
              <Text style={styles.actionIcon}>↪</Text>
              <Text style={styles.actionLabel}>Déconnexion</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* ══════════ SUPPRIMER COMPTE ══════════ */}
            <TouchableOpacity style={styles.deleteRow} onPress={handleDeleteAccount}>
              <Text style={styles.deleteIcon}>🗑</Text>
              <Text style={styles.deleteLabel}>Supprimer mon compte</Text>
            </TouchableOpacity>

            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                Remarque : La suppression de votre compte n'annulera pas votre abonnement.
                Si vous souhaitez annuler votre abonnement, veuillez le gérer sur le Google Play Store.
              </Text>
              <Text style={[styles.noticeText, { marginTop: 8 }]}>
                La suppression de votre compte supprimera toutes vos données de nos serveurs.
              </Text>
              <Text style={[styles.noticeText, { marginTop: 8 }]}>
                Besoin de plus d'informations ? Consultez les{' '}
                <Text style={styles.qaLink}>Q&A</Text>.
              </Text>
            </View>

            <View style={{ height: 60 }} />
          </ScrollView>

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

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

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatarIcon: { fontSize: 36 },
  emailText: { color: '#333', fontSize: 15, textAlign: 'center', fontWeight: '500' },
  editHint: { color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 4 },

  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#333',
    fontSize: 15,
  },
  saveBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cancelEditBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#eee',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelEditText: { color: '#666', fontWeight: '800' },

  proBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.accent,
  },
  proBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  proCrown: { fontSize: 26, color: '#fff' },
  proBannerText: { flex: 1, color: '#fff', fontWeight: '800', fontSize: 16 },
  proArrow: { color: '#fff', fontSize: 22 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
    marginTop: 16,
  },
  actionIcon: { fontSize: 20, color: '#555' },
  actionLabel: { color: '#333', fontSize: 15, fontWeight: '500' },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: 20,
  },

  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  deleteIcon: { fontSize: 20 },
  deleteLabel: { color: COLORS.error, fontSize: 15, fontWeight: '600' },

  noticeBox: { paddingHorizontal: 20, paddingTop: 4 },
  noticeText: { color: '#888', fontSize: 13, lineHeight: 20 },
  qaLink: { color: COLORS.primary, fontWeight: '600' },
});
