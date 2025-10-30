// Components/GameResultsScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Share,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG      = require('../assets/bg.webp');
const LOGO    = require('../assets/avatar.webp');
const PRESENT = require('../assets/presant.webp'); // ⭐ картинка подарка для модалки

const NAVY      = '#0d2235';
const NAVY_DARK = '#0b1c2c';
const ORANGE    = '#d77a2b';
const TEXT      = '#ffffff';

// Пожелания
const WISHES = [
  'Everyone has to say something nice about the person who made the wish.',
  'The team has to make up a song about that player and sing one line.',
  'Everyone has to repeat a funny phrase that you came up with.',
  'One of the players has to tell a short joke especially for you.',
  'Everyone has to make the weirdest face at the same time.',
  'One player has to compliment you as if it were a formal speech.',
  'Everyone has to call you the new “Bull” for the next round.',
  'The team has to come up with a new name or nickname for you.',
  'Everyone has to tell you why they would invite you to their team.',
  'One of the players has to read something like a show host in your honor.',
];

export default function GameResultsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const headerTopPadding = insets.top + 18;

  const scores = route.params?.scores ?? {};
  const results = useMemo(() => {
    const arr = Object.entries(scores).map(([name, points]) => ({ name, points }));
    return arr.sort((a, b) => b.points - a.points);
  }, [scores]);
  const winner = results[0];

  const [wishOpen, setWishOpen] = useState(false);
  const [wishText, setWishText] = useState('');

  const openWish = () => {
    const rand = Math.floor(Math.random() * WISHES.length);
    setWishText(WISHES[rand]);
    setWishOpen(true);
  };

  const onShare = async () => {
    try {
      const lines = results.map((r, i) => `${i + 1}. ${r.name} — ${r.points}`).join('\n');
      await Share.share({
        message: `Bull’s Dare Eye — Results:\n${lines}\nWinner: ${winner?.name ?? '-'}`,
      });
    } catch {}
  };

  const BOTTOM_BAR_H = 164 + insets.bottom;

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: headerTopPadding }]}>
        <Text style={styles.title}>FINAL! GAME OVER</Text>
      </View>

      {/* Контент прокручивается под нижним баром */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: BOTTOM_BAR_H + 16 }}>
        {/* Большая карточка с результатами */}
        <View style={styles.bigCard}>
          {/* Мини-баннер с avatar справа (обрезается за правым краем) */}
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Everyone was great,{'\n'}stay as you are!
            </Text>
            <Image source={LOGO} style={styles.bannerAvatar} resizeMode="contain" />
          </View>

          <Text style={styles.sectionTitle}>Results:</Text>

          {/* Победитель */}
          {winner && (
            <View style={[styles.resultPill, { backgroundColor: ORANGE }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName}>{winner.name}</Text>
                <Text style={styles.playerSub}>Make a wish for whoever you want</Text>
              </View>
              <Text style={styles.points}>{winner.points}</Text>
            </View>
          )}

          {/* Остальные */}
          {results.slice(1).map((r) => (
            <View key={r.name} style={[styles.resultPill, styles.resultPillDark]}>
              <Text style={[styles.playerName, { marginBottom: 0 }]}>{r.name}</Text>
              <Text style={[styles.points, { marginLeft: 'auto' }]}>{r.points}</Text>
            </View>
          ))}

          <TouchableOpacity onPress={onShare} style={[styles.smallBtn, { alignSelf: 'flex-start' }]}>
            <Text style={styles.smallBtnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Прилипший к низу Action-бар */}
      <View style={[styles.bottomSticky, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={openWish}>
          <Text style={styles.primaryTxt}>Get a wish from the box</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.popToTop()}>
          <Text style={styles.secondaryTxt}>End the game</Text>
        </TouchableOpacity>
      </View>

      {/* Модалка с полученным "призом" */}
      <Modal
        visible={wishOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setWishOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Image source={PRESENT} style={styles.presentImg} resizeMode="contain" />
            <Text style={styles.wishText}>{wishText}</Text>

            {/* Ссылка как на макете */}
            <Pressable
              onPress={() => {
                setWishOpen(false);
                navigation.popToTop();
              }}
              style={{ marginTop: 12 }}
            >
              <Text style={styles.linkTxt}>Ok, exit to menu</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: { color: TEXT, fontSize: 26, fontWeight: '900', letterSpacing: 0.5 },

  bigCard: { backgroundColor: NAVY, borderRadius: 26, padding: 16, gap: 14 },

  banner: {
    height: 120,
    backgroundColor: NAVY_DARK,
    borderRadius: 18,
    padding: 14,
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerAvatar: {
    width: 190,
    height: 190,
    position: 'absolute',
    right: -40,
    top: -23,
  },
  bannerText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: 100,
    paddingRight: 8,
  },

  sectionTitle: { color: TEXT, fontSize: 20, fontWeight: '900', marginTop: 4, marginBottom: 2 },

  resultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  resultPillDark: { backgroundColor: '#0f2a43', marginTop: 10 },
  playerName: { color: TEXT, fontSize: 16, fontWeight: '800', marginBottom: 2 },
  playerSub: { color: '#f4eadf', opacity: 0.95 },
  points: { color: TEXT, fontSize: 16, fontWeight: '900' },

  smallBtn: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginTop: 12,
  },
  smallBtnText: { color: TEXT, fontWeight: '800', fontSize: 15 },

  // Sticky bottom bar
  bottomSticky: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: NAVY,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  primaryBtn: { backgroundColor: ORANGE, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  primaryTxt: { color: TEXT, fontSize: 18, fontWeight: '900' },
  secondaryBtn: {
    borderRadius: 16,
    borderWidth: 1.4,
    borderColor: 'rgba(215,122,43,0.8)',
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 14,
  },
  secondaryTxt: { color: TEXT, fontSize: 18, fontWeight: '800' },

  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: NAVY,
    borderRadius: 22,
    padding: 22,
    width: '100%',
    alignItems: 'center',
  },
  presentImg: { width: 180, height: 180, marginBottom: 8 },
  wishText: { color: TEXT, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 6, fontWeight: '800' , paddingHorizontal:40,},
  linkTxt: { color: '#cfe3ff', textDecorationLine: 'underline', fontSize: 16, fontWeight: '700' },
});
