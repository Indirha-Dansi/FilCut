import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';

const COLORS = {
  primary: '#E8294C',
  primaryLight: '#FF4D6D',
  secondary: '#8A2BE2',
  bgDark: '#0D0D0D',
  bgCard: '#1A1A1A',
  bgCardLight: '#242424',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

const S = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
  textXs: 11, textSm: 13, textBase: 15, textXl: 22, text2xl: 28,
  radius: 12, radiusLg: 20,
  inputH: 52, btnH: 52,
};

interface Props {
  navigation: any;
}

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Force du mot de passe ──────────────────────────────────────────────────
  const getStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6)   return { label: 'Trop court', color: COLORS.error,   width: '25%' };
    if (password.length < 8)   return { label: 'Faible',     color: COLORS.warning,  width: '50%' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
                               return { label: 'Fort 💪',    color: COLORS.success,  width: '100%' };
    return                            { label: 'Moyen',      color: COLORS.warning,  width: '75%' };
  };
  const strength = getStrength();

  // ── Inscription ────────────────────────────────────────────────────────────
  const handleRegister = () => {
    if (!email.trim()) {
      Alert.alert('Email requis', 'Veuillez saisir votre adresse email.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe trop court', 'Minimum 6 caractères.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('✅ Compte créé !', 'Supabase sera branché bientôt.');
    }, 1500);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ══════════ BOUTON RETOUR ══════════ */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* ══════════ LOGO ══════════ */}
            <View style={styles.header}>
              <Text style={styles.logo}>
                <Text style={{ color: COLORS.textPrimary, fontWeight: '300' }}>Fil</Text>
                <Text style={{ color: COLORS.primary, fontWeight: '800' }}>Cut</Text>
              </Text>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>Rejoignez des milliers de créateurs</Text>
            </View>

            {/* ══════════ FORMULAIRE ══════════ */}
            <View style={styles.card}>

              {/* Email */}
              <Text style={styles.label}>Adresse email</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="vous@exemple.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Mot de passe */}
              <Text style={[styles.label, { marginTop: S.md }]}>Mot de passe</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>🔒</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Minimum 6 caractères"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={{ padding: S.xs }}>
                  <Text style={{ fontSize: 16 }}>{showPwd ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              {/* Indicateur de force */}
              {strength && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthBar}>
                    <View style={[
                      styles.strengthFill,
                      { width: strength.width as any, backgroundColor: strength.color }
                    ]} />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}

              {/* Confirmation mot de passe */}
              <Text style={[styles.label, { marginTop: S.md }]}>Confirmer le mot de passe</Text>
              <View style={[
                styles.inputRow,
                confirm.length > 0 && password !== confirm
                  ? { borderColor: COLORS.error }
                  : {}
              ]}>
                <Text style={styles.icon}>🔑</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Répétez votre mot de passe"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={{ padding: S.xs }}>
                  <Text style={{ fontSize: 16 }}>{showConfirm ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              {/* Message erreur confirmation */}
              {confirm.length > 0 && password !== confirm && (
                <Text style={styles.errorMsg}>❌ Les mots de passe ne correspondent pas</Text>
              )}

              {/* Bouton Créer mon compte */}
              <TouchableOpacity
                style={[styles.submitBtn, { marginTop: S.lg }]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.submitBtnText}>Créer mon compte</Text>
                }
              </TouchableOpacity>

              {/* Séparateur */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google */}
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => Alert.alert('Google', 'Bientôt disponible !')}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#EA4335' }}>G</Text>
                <Text style={styles.googleText}>S'inscrire avec Google</Text>
              </TouchableOpacity>

            </View>

            {/* ══════════ LIEN CONNEXION ══════════ */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>

            {/* Mentions légales */}
            <Text style={styles.legal}>
              En créant un compte, vous acceptez nos{' '}
              <Text style={{ color: COLORS.primaryLight }}>Conditions d'utilisation</Text>
            </Text>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: S.lg,
    paddingTop: 50,
    paddingBottom: 40,
  },

  // Retour
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: S.lg,
  },
  backIcon: {
    color: COLORS.textPrimary,
    fontSize: 20,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: S.xl,
  },
  logo: {
    fontSize: S.text2xl,
    marginBottom: S.sm,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: S.textXl,
    fontWeight: '700',
    marginBottom: S.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: S.textBase,
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: S.radiusLg,
    padding: S.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  // Inputs
  label: {
    color: COLORS.textSecondary,
    fontSize: S.textSm,
    fontWeight: '600',
    marginBottom: S.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCardLight,
    borderRadius: S.radius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: S.md,
    height: S.inputH,
  },
  icon: {
    fontSize: 16,
    marginRight: S.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: S.textBase,
  },

  // Force mot de passe
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: S.xs,
    gap: S.sm,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: S.textXs,
    fontWeight: '600',
  },

  // Erreur
  errorMsg: {
    color: COLORS.error,
    fontSize: S.textXs,
    marginTop: S.xs,
  },

  // Bouton submit
  submitBtn: {
    height: S.btnH,
    borderRadius: S.radius,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: S.textBase,
    fontWeight: '700',
  },

  // Séparateur
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: S.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: COLORS.textMuted,
    marginHorizontal: S.md,
    fontSize: S.textSm,
  },

  // Google
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: S.btnH,
    borderRadius: S.radius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: S.sm,
  },
  googleText: {
    color: COLORS.textPrimary,
    fontSize: S.textBase,
    fontWeight: '600',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: S.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: S.textBase,
  },
  footerLink: {
    color: COLORS.primaryLight,
    fontSize: S.textBase,
    fontWeight: '700',
  },

  // Légal
  legal: {
    color: COLORS.textMuted,
    fontSize: S.textXs,
    textAlign: 'center',
    marginTop: S.lg,
    lineHeight: 18,
  },
});
