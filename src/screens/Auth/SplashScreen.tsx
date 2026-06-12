import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { authService } from '../../services/supabase';

const COLORS = {
  primary:   '#E8294C',
  secondary: '#8A2BE2',
  bgDark:    '#0D0D0D',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
};

interface Props {
  navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
  const logoScale   = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(textY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]),
    ]).start();

    const timer = setTimeout(async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      } catch {
        navigation.replace('Login');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <View style={styles.container}>
        <View style={[styles.orb, styles.orbTop]} />
        <View style={[styles.orb, styles.orbBottom]} />

        <Animated.View style={[styles.logoWrapper, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoIcon}>
            <View style={styles.filmRow}>
              <View style={styles.filmHoles}>
                {[0,1,2].map(i => <View key={i} style={styles.hole} />)}
              </View>
              <View style={styles.filmScreen} />
              <View style={styles.filmHoles}>
                {[0,1,2].map(i => <View key={i} style={styles.hole} />)}
              </View>
            </View>
            <View style={styles.scissor} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
          <Text style={styles.logoText}>
            <Text style={{ color: COLORS.textPrimary, fontWeight: '300' }}>Fil</Text>
            <Text style={{ color: COLORS.primary, fontWeight: '800' }}>Cut</Text>
          </Text>
          <Text style={styles.tagline}>Montage. Collage. Magie.</Text>
        </Animated.View>

        <Animated.View style={[styles.loaderWrap, { opacity: textOpacity }]}>
          <View style={styles.loaderBar}>
            <View style={styles.loaderFill} />
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center' },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.12 },
  orbTop: { width: 300, height: 300, backgroundColor: '#8A2BE2', top: -80, right: -60 },
  orbBottom: { width: 250, height: 250, backgroundColor: '#E8294C', bottom: -60, left: -80 },
  logoWrapper: { marginBottom: 32 },
  logoIcon: {
    width: 130, height: 130, borderRadius: 30,
    backgroundColor: '#E8294C', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  filmRow: { flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 30, left: 15 },
  filmHoles: { flexDirection: 'column', justifyContent: 'space-between', height: 60 },
  hole: { width: 8, height: 12, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2, marginVertical: 2 },
  filmScreen: { width: 50, height: 50, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, marginHorizontal: 4 },
  scissor: {
    position: 'absolute', width: 100, height: 3,
    backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2,
    transform: [{ rotate: '-45deg' }], bottom: 35, left: 5,
  },
  textBlock: { alignItems: 'center' },
  logoText: { fontSize: 36 },
  tagline: { color: '#AAAAAA', fontSize: 13, marginTop: 4, letterSpacing: 3, textTransform: 'uppercase' },
  loaderWrap: { position: 'absolute', bottom: 60 },
  loaderBar: { width: 120, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden' },
  loaderFill: { height: '100%', width: '60%', backgroundColor: '#E8294C', borderRadius: 1 },
});
