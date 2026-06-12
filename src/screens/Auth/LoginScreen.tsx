import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { authService } from '../../services/supabase';

const COLORS = {
  primary: '#E8294C', primaryLight: '#FF4D6D',
  bgDark: '#0D0D0D', bgCard: '#1A1A1A', bgCardLight: '#242424',
  textPrimary: '#FFFFFF', textSecondary: '#AAAAAA', textMuted: '#666666',
};
const S = {
  xs:4, sm:8, md:16, lg:24, xl:32,
  textXs:11, textSm:13, textBase:15, textXl:22, text2xl:28,
  radius:12, radiusLg:20, inputH:52, btnH:52,
};

interface Props { navigation: any; }

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // ── Connexion Supabase ─────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir votre email et mot de passe.');
      return;
    }
    setLoading(true);
    try {
      await authService.signIn(email.trim(), password);
      navigation.replace('Home');
    } catch (err: any) {
      const msg = err.message?.includes('Invalid login credentials')
        ? 'Email ou mot de passe incorrect.'
        : err.message || 'Une erreur est survenue.';
      Alert.alert('Erreur de connexion', msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Mot de passe oublié ────────────────────────────────────────────────────
  const handleForgot = async () => {
    if (!email.trim()) {
      Alert.alert('Email requis', "Saisissez d'abord votre adresse email.");
      return;
    }
    setForgotLoading(true);
    try {
      await authService.resetPassword(email.trim());
      Alert.alert('📬 Email envoyé', 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.');
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <View style={styles.header}>
              <Text style={styles.logo}>
                <Text style={{ color: COLORS.textPrimary, fontWeight: '300' }}>Fil</Text>
                <Text style={{ color: COLORS.primary, fontWeight: '800' }}>Cut</Text>
              </Text>
              <Text style={styles.welcome}>Bon retour ! 👋</Text>
              <Text style={styles.subtitle}>Connectez-vous pour continuer votre création</Text>
            </View>

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
                  placeholder="••••••••"
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

              {/* Mot de passe oublié */}
              <TouchableOpacity
                onPress={handleForgot}
                disabled={forgotLoading}
                style={{ alignSelf: 'flex-end', marginTop: S.sm, marginBottom: S.lg }}
              >
                <Text style={styles.forgotText}>
                  {forgotLoading ? 'Envoi...' : 'Mot de passe oublié ?'}
                </Text>
              </TouchableOpacity>

              {/* Bouton connexion */}
              <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.loginBtnText}>Se connecter</Text>
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
              >
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#EA4335' }}>G</Text>
                <Text style={styles.googleText}>Continuer avec Google</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Pas encore de compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>S'inscrire</Text>
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
  scroll: { flexGrow: 1, paddingHorizontal: S.lg, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: S.xl },
  logo: { fontSize: S.text2xl, marginBottom: S.md },
  welcome: { color: COLORS.textPrimary, fontSize: S.textXl, fontWeight: '700', marginBottom: S.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: S.textBase, textAlign: 'center' },
  card: { backgroundColor: COLORS.bgCard, borderRadius: S.radiusLg, padding: S.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  label: { color: COLORS.textSecondary, fontSize: S.textSm, fontWeight: '600', marginBottom: S.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCardLight, borderRadius: S.radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: S.md, height: S.inputH },
  icon: { fontSize: 16, marginRight: S.sm },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: S.textBase },
  forgotText: { color: COLORS.primaryLight, fontSize: S.textSm, fontWeight: '600' },
  loginBtn: { height: S.btnH, borderRadius: S.radius, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { color: '#fff', fontSize: S.textBase, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: S.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { color: COLORS.textMuted, marginHorizontal: S.md, fontSize: S.textSm },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: S.btnH, borderRadius: S.radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', gap: S.sm },
  googleText: { color: COLORS.textPrimary, fontSize: S.textBase, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: S.xl },
  footerText: { color: COLORS.textSecondary, fontSize: S.textBase },
  footerLink: { color: COLORS.primaryLight, fontSize: S.textBase, fontWeight: '700' },
});
