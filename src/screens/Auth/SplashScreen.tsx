// src/screens/Auth/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { COLORS, SIZES } from '../../utils/theme';

interface Props {
  navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(textY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Après 2.5s on navigue vers Login
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <View style={styles.container}>

        {/* Cercles décoratifs flous */}
        <View style={[styles.orb, styles.orbTop]} />
        <View style={[styles.orb, styles.orbBottom]} />

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoIcon}>
            {/* Film strip simulé */}
            <View style={styles.filmRow}>
              <View style={styles.filmHoles}>
                {[0,1,2].map(i => <View key={i} style={styles.hole} />)}
              </View>
              <View style={styles.filmScreen} />
              <View style={styles.filmHoles}>
                {[0,1,2].map(i => <View key={i} style={styles.hole} />)}
              </View>
            </View>
            {/* Barre diagonale = ciseaux */}
            <View style={styles.scissor} />
          </View>
        </Animated.View>

        {/* Texte FilCut */}
        <Animated.View
          style={[
            styles.textBlock,
            {
              opacity: textOpacity,
              transform: [{ translateY: textY }],
            },
          ]}
        >
          <Text style={styles.logoText}>
            <Text style={styles.fil}>Fil</Text>
            <Text style={styles.cut}>Cut</Text>
          </Text>
          <Text style={styles.tagline}>Montage. Collage. Magie.</Text>
        </Animated.View>

        {/* Barre de chargement */}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
  },
  orbTop: {
    width: 300,
    height: 300,
    backgroundColor: COLORS.secondary,
    top: -80,
    right: -60,
  },
  orbBottom: {
    width: 250,
    height: 250,
    backgroundColor: COLORS.primary,
    bottom: -60,
    left: -80,
  },
  logoWrapper: {
    marginBottom: SIZES.xl,
  },
  logoIcon: {
    width: 130,
    height: 130,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  filmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 30,
    left: 15,
  },
  filmHoles: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 60,
  },
  hole: {
    width: 8,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
    marginVertical: 2,
  },
  filmScreen: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  scissor: {
    position: 'absolute',
    width: 100,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
    bottom: 35,
    left: 5,
  },
  textBlock: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: SIZES.text3xl,
  },
  fil: {
    color: COLORS.textPrimary,
    fontWeight: '300',
  },
  cut: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: SIZES.textSm,
    marginTop: SIZES.xs,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 60,
  },
  loaderBar: {
    width: 120,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    width: '60%',
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
});