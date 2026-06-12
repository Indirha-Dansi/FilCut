import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { authService } from '../../services/supabase';

const COLORS = {
  primary: '#E8294C', primaryLight: '#FF4D6D', secondary: '#8A2BE2',
  bgDark: '#0D0D0D', bgCard: '#1A1A1A', bgCardLight: '#242424',
  textPrimary: '#FFFFFF', textSecondary: '#AAAAAA', textMuted: '#666666',
  success: '#22C55E', warning: '#F59E0B', error: '#EF4444',
};
const S = {
  xs:4, sm:8, md:16, lg:24, xl:32,
  textXs:11, textSm:13, textBase:15, textXl:22, text2xl:28,
  radius:12, radiusLg:20, inputH:52, btnH:52,
};

interface Props { navigation: any; }

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6)   return { label: 'Trop court', color: COLORS.error,   width: '25%' };
    if (password.length < 8)   return { label: 'Faible',     color: COLORS.warning,  width: '50%' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
                               return { label: 'Fort 💪',    color: COLORS.success,  width: '100%' };
    return                            { label: 'Moyen',      color: COLORS.warning,  width: '75%' };
  };
  const strength = getStrength();

  // ── Inscription Supabase ───────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!email.trim()) { Alert.alert('Email requis', 'Veuillez saisir votre adresse email.'); return; }
    if (password.length < 6) { Alert.alert('Mot de passe trop court', 'Minimum 6 caractères.'); return; }
    if (password !== confirm) { Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.'); return; }

    setLoading(true);
    try {
      const data = await authService.signUp(email.trim(), password);

      // Supabase envoie un email de confirmation
      if (data.user && !data.session) {
        Alert.alert(
          '📬 Vérifiez votre email',
          'Un lien de confirmation a été envoyé à votre adresse email. Cliquez dessus pour activer votre compte.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
        );
        return;
      }

      // Connexion directe si confirmation désactivée dans Supabase
      if (data.user) {
        navigation.replace('Home');
      }
    } catch (err: any) {
      const msg = err.message?.includes('already registered')
        ? 'Cette adresse email est déjà utilisée.'
        : err.message || "Erreur lors de l'inscription.";
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.logo}>
                <Text style={{ color: COLORS.textPrimary, fontWeight: '300' }}>Fil</Text>
                <Text style={{ color: COLORS.primary, fontWeight: '800' }}>Cut</Text>
              </Text>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>Rejoignez des milliers de créateurs</Text>
            </View>

            <View style={styles.card}>
              {/* Email */}
              <Text style={styles.label}>Adresse email</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>✉️</Text>
                <TextInput style={styles.input} placeholder="vous@exemple.com" placeholderTextColor={COLORS.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
              </View>

              {/* Mot de passe */}
              <Text style={[styles.label, { marginTop: S.md }]}>Mot de passe</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>🔒</Text>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Minimum 6 caractères" placeholderTextColor={COLORS.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPwd} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={{ padding: S.xs }}>
                  <Text style={{ fontSize: 16 }}>{showPwd ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              {/* Force */}
              {strength && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthBar}>
                    <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                </View>
              )}

              {/* Confirmation */}
              <Text style={[styles.label, { marginTop: S.md }]}>Confirmer le mot de passe</Text>
              <View style={[styles.inputRow, confirm.length > 0 && password !== confirm ? { borderColor: COLORS.error } : {}]}>
                <Text style={styles.icon}>🔑</Text>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Répétez votre mot de passe" placeholderTextColor={COLORS.textMuted} value={confirm} onChangeText={setConfirm} secureTextEntry={!showConfirm} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={{ padding: S.xs }}>
                  <Text style={{ fontSize: 16 }}>{showConfirm ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {confirm.length > 0 && password !== confirm && (
                <Text style={styles.errorMsg}>❌ Les mots de passe ne correspondent pas</Text>
              )}

              {/* Bouton */}
              <TouchableOpacity style={[styles.submitBtn, { marginTop: S.lg }]} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Créer mon compte</Text>}
              </TouchableOpacity>

              {/* Séparateur */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google */}
              <TouchableOpacity style={styles.googleBtn} onPress={() => Alert.alert('Google', 'Bientôt disponible !')}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#EA4335' }}>G</Text>
                <Text style={styles.googleText}>S'inscrire avec Google</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { flexGrow: 1, paddingHorizontal: S.lg, paddingTop: 50, paddingBottom: 40 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center', marginBottom: S.lg },
  backIcon: { color: COLORS.textPrimary, fontSize: 20 },
  header: { alignItems: 'center', marginBottom: S.xl },
  logo: { fontSize: S.text2xl, marginBottom: S.sm },
  title: { color: COLORS.textPrimary, fontSize: S.textXl, fontWeight: '700', marginBottom: S.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: S.textBase, textAlign: 'center' },
  card: { backgroundColor: COLORS.bgCard, borderRadius: S.radiusLg, padding: S.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  label: { color: COLORS.textSecondary, fontSize: S.textSm, fontWeight: '600', marginBottom: S.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCardLight, borderRadius: S.radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: S.md, height: S.inputH },
  icon: { fontSize: 16, marginRight: S.sm },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: S.textBase },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: S.xs, gap: S.sm },
  strengthBar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthLabel: { fontSize: S.textXs, fontWeight: '600' },
  errorMsg: { color: COLORS.error, fontSize: S.textXs, marginTop: S.xs },
  submitBtn: { height: S.btnH, borderRadius: S.radius, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#fff', fontSize: S.textBase, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: S.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { color: COLORS.textMuted, marginHorizontal: S.md, fontSize: S.textSm },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: S.btnH, borderRadius: S.radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', gap: S.sm },
  googleText: { color: COLORS.textPrimary, fontSize: S.textBase, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: S.xl },
  footerText: { color: COLORS.textSecondary, fontSize: S.textBase },
  footerLink: { color: COLORS.primaryLight, fontSize: S.textBase, fontWeight: '700' },
});
