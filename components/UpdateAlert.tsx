import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface UpdateAlertProps {
  visible: boolean;
  type: 'soft' | 'hard' | 'ota' | null;
  onUpdate: () => void;
  onCancel: () => void;
}

const { width } = Dimensions.get('window');

export default function UpdateAlert({ visible, type, onUpdate, onCancel }: UpdateAlertProps) {
  const { theme } = useTheme();

  if (!visible || !type) return null;

  const isHardUpdate = type === 'hard';
  const isOTA = type === 'ota';

  let title = 'UPDATE';
  let message = 'New features calculated.';
  // Using Ionicons as the "pre-downloaded" graphic. 
  // It's bundled with the app, so it loads instantly (0ms latency).
  let iconName: keyof typeof Ionicons.glyphMap = 'arrow-down-circle'; 
  let iconColor = theme.accent;

  if (isHardUpdate) {
    title = 'CRITICAL';
    message = 'Update required to continue.';
    iconName = 'alert-circle';
    iconColor = '#FF453A'; 
  } else if (isOTA) {
    title = 'PATCHING';
    message = 'Applying fix...';
    iconName = 'cloud-download';
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        if (!isHardUpdate) onCancel();
      }}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
        {/* Calculator Body Look */}
        <View style={[styles.calculatorBody, { backgroundColor: theme.dark }]}>
          
          {/* Display Screen Area */}
          <View style={[styles.screenArea, { backgroundColor: theme.black }]}>
             <View style={styles.headerRow}>
                {/* Text-based dots for instant rendering */}
                <Text style={[styles.headerDots, { color: theme.gray }]}>:::</Text>
                <Text style={[styles.headerText, { color: theme.gray }]}>SYS.VER.{isOTA ? 'OTA' : 'STORE'}</Text>
             </View>
             
             <View style={styles.mainDisplay}>
                <Ionicons name={iconName} size={64} color={iconColor} style={{ marginRight: 15 }} />
                <View style={{ flex: 1 }}>
                    <Text style={[styles.displayTextTitle, { color: theme.textPrimary }]}>{title}</Text>
                    <Text style={[styles.displayTextMessage, { color: theme.textSecondary }]}>{message}</Text>
                </View>
             </View>
          </View>

          {/* Keypad Area */}
          <View style={styles.keypadArea}>
             <View style={styles.row}>
                {!isHardUpdate && !isOTA && (
                  <TouchableOpacity 
                    style={[styles.calcButton, { backgroundColor: theme.secondary }]} 
                    onPress={onCancel}
                  >
                    <Text style={[styles.calcButtonLabel, { color: theme.textSecondary, fontSize: 14, marginTop: 0 }]}>LATER</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={[
                    styles.calcButton, 
                    { backgroundColor: isHardUpdate ? '#FF453A' : theme.accent, flex: 2 } 
                  ]} 
                  onPress={onUpdate}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="enter-outline" size={20} color="#FFF" />
                    <Text style={[styles.calcButtonLabel, { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 0 }]}>
                        {isOTA ? 'RESTART' : 'UPDATE'}
                    </Text>
                  </View>
                </TouchableOpacity>
             </View>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorBody: {
    width: width * 0.85,
    borderRadius: 25,
    padding: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  screenArea: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  headerDots: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -2, 
  },
  headerText: {
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 2,
  },
  mainDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayTextTitle: {
    fontSize: 28,
    fontWeight: '300', // Light font for digital look
    textAlign: 'right',
    letterSpacing: 1,
  },
  displayTextMessage: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 5,
    fontFamily: 'monospace',
  },
  keypadArea: {
    flexDirection: 'column',
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  calcButton: {
    height: 60, // Reduced from 80
    flex: 1,
    borderRadius: 15, // Adjusted radius for smaller height
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calcButtonLabel: {
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1,
    fontWeight: 'bold',
  }
});
