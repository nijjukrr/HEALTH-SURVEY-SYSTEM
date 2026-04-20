import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface TelemedicineProps {
  onBack: () => void;
}

const doctors = [
  { id: 1, name: 'Dr. Anjali Gupta', spec: 'General Physician', exp: '8 years', online: true },
  { id: 2, name: 'Dr. Rajesh Kumar', spec: 'Epidemiologist', exp: '12 years', online: false },
  { id: 3, name: 'Dr. Sarah Khan', spec: 'Pediatrician', exp: '5 years', online: true },
];

const Telemedicine: React.FC<TelemedicineProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleCall = (doctorName: string) => {
    Alert.alert('Connecting...', `Starting secure video consultation with ${doctorName}. \n\nPlease wait while we establish a connection.`);
  };

  const handleChat = (doctorName: string) => {
    Alert.alert('Chat Started', `You are now chatting with ${doctorName}.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Telemedicine</Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Feeling Unwell?</Text>
        <Text style={styles.bannerText}>Consult with certified doctors instantly.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Doctors</Text>
        {doctors.map(doc => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docAvatar}>
              <Text style={styles.avatarText}>{doc.name[4]}</Text>
              {doc.online && <View style={styles.onlineBadge} />}
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>{doc.name}</Text>
              <Text style={styles.docSpec}>{doc.spec} • {doc.exp}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.primary + '20', marginRight: 8 }]}
                onPress={() => handleChat(doc.name)}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.success }]}
                onPress={() => handleCall(doc.name)}
              >
                <Ionicons name="videocam" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xl },
  backButton: { marginRight: spacing.md },
  title: { ...typography.title3, color: colors.text },
  banner: { margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.primary + '20', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary + '40' },
  bannerTitle: { ...typography.headline, color: colors.primary, marginBottom: 4 },
  bannerText: { ...typography.caption1, color: colors.textSecondary },
  section: { padding: spacing.lg },
  sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.md },
  docCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  docAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  avatarText: { ...typography.title3, color: colors.textSecondary },
  onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.surface },
  docInfo: { flex: 1 },
  docName: { ...typography.headline, color: colors.text },
  docSpec: { ...typography.caption2, color: colors.textSecondary },
  actionButtons: { flexDirection: 'row' },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});

export default Telemedicine;