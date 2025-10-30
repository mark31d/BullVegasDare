// Components/HomeScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RippleButton from './RippleButton';
import SplitText from './SplitTextRN';

const BG   = require('../assets/bg.webp');
const LOGO = require('../assets/Logo.webp'); // <-- квадратный логотип

const ORANGE = '#0d2235';
const NAVY   = '#0d2235';
const TEXT   = '#ffffff';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(50, insets.top);

  // плавное появление
  const o = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    StatusBar.setHidden(false, 'fade');
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [o, y]);

  // одинаковая ширина кнопок
  const BUTTON_W = Math.min( width - 48, 560 );
  const LOGO_W   = Math.min( width - 48, 560 );

  // безопасная навигация (если экрана нет — не падаем)
  const go = (name) => {
    const names = navigation.getState?.().routeNames ?? [];
    if (names.includes(name)) navigation.navigate(name);
    else console.warn('Screen not found:', name);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ImageBackground source={BG} resizeMode="cover" style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.centerAll, { opacity: o, transform: [{ translateY: y }], paddingTop: topPadding }]}>
        {/* ЛОГО по центру, без прозрачностей */}
        <View style={[styles.logoBox, { width: LOGO_W, height: LOGO_W }]}>
          <Image source={LOGO} style={styles.logoImg} resizeMode="contain" />
        </View>

        {/* КНОПКИ: большие и одинаковые */}
        <View style={styles.buttons}>
          <RippleButton
            onPress={() => go('GameSetup')}
            rippleColor="rgba(255,255,255,0.35)"
            duration={600}
            style={[styles.btn, { width: BUTTON_W }]}
          >
            <SplitText
              text="START GAME"
              splitType="chars"
              delay={10}
              duration={0.26}
              from={{ opacity: 0, y: 8 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
              style={styles.btnText}
            />
          </RippleButton>

          <RippleButton
            onPress={() => go('GameRules')}
            rippleColor="rgba(255,255,255,0.35)"
            duration={600}
            style={[styles.btn, { width: BUTTON_W }]}
          >
            <SplitText
              text="GAME RULES"
              splitType="chars"
              delay={10}
              duration={0.26}
              from={{ opacity: 0, y: 8 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
              style={styles.btnText}
            />
          </RippleButton>

          <RippleButton
            onPress={() => go('Settings')} // если экрана нет — просто предупреждение в консоль
            rippleColor="rgba(255,255,255,0.35)"
            duration={600}
            style={[styles.btn, { width: BUTTON_W }]}
          >
            <SplitText
              text="SETTINGS"
              splitType="chars"
              delay={10}
              duration={0.26}
              from={{ opacity: 0, y: 8 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
              style={styles.btnText}
            />
          </RippleButton>

          <RippleButton
            onPress={() => go('Info')}
            rippleColor="rgba(255,255,255,0.35)"
            duration={600}
            style={[styles.btn, { width: BUTTON_W }]}
          >
            <SplitText
              text="INFO"
              splitType="chars"
              delay={10}
              duration={0.26}
              from={{ opacity: 0, y: 8 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
              style={styles.btnText}
            />
          </RippleButton>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  // всё строго по центру
  centerAll: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 22,
  },

  // логотип: сплошной тёмно-синий фон, без прозрачностей
  logoBox: {
    backgroundColor: NAVY,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: { width: '86%', height: '86%' , borderRadius:15,},

  // кнопки
  buttons: { alignItems: 'center', gap: 16 },
  btn: {
    height: 82,                 // большой фиксированный размер
    backgroundColor: ORANGE,    // сплошной
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // без полупрозрачных карточек; легкая тень можно оставить
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  btnText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
