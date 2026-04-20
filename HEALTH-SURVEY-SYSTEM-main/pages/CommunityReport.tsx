import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface CommunityReportProps {
  onBack: () => void;
}

const CommunityReport: React.FC<CommunityReportProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('Searching for GPS signal...');
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    // Simulate fetching GPS location
    const timer = setTimeout(() => {
      setLocation('11.0168° N, 76.9558° E (Coimbatore)');
      setIsLocating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleTakePhoto = async () => {
    if (Platform.OS !== 'web') {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission Refused", "You need to grant camera permissions to use this feature.");
        return;
      }
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'] as any,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera Error:", error);
      Alert.alert("Error", "Could not open camera.");
    }
  };

  const handlePickGallery = async () => {
    if (Platform.OS !== 'web') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission Refused", "You've refused to allow this app to access your photos.");
        return;
      }
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'] as any,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery Error:", error);
      Alert.alert("Error", "Could not open gallery.");
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUri(null);
  };

  const handleSubmit = () => {
    if (!issueType) {
      Alert.alert('Missing Information', 'Please select an issue type.');
      return;
    }
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Report Submitted', 'Thank you for helping your community! Your report has been logged and sent to local health authorities for verification.');
      onBack();
    }, 1500);
  };

  const issueTypes = [
    { id: 'leak', label: 'Broken Pipe', icon: 'water' },
    { id: 'stagnant', label: 'Stagnant Water', icon: 'cloud' },
    { id: 'drain', label: 'Open Drain', icon: 'alert-circle' },
    { id: 'smell', label: 'Foul Smell', icon: 'skull' },
    { id: 'dirty', label: 'Contamination', icon: 'color-fill' },
    { id: 'no_water', label: 'No Supply', icon: 'close-circle' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Report an Issue</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>What's the issue?</Text>
        <View style={styles.grid}>
          {issueTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeCard, issueType === type.id && styles.typeCardActive]}
              onPress={() => setIssueType(type.id)}
            >
              <Ionicons
                name={type.icon as any}
                size={32}
                color={issueType === type.id ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.typeLabel, issueType === type.id && styles.typeLabelActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationCard}>
          {isLocating ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="location" size={20} color={colors.primary} />
          )}
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Photo Evidence</Text>
        {photoUri ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhotoButton} onPress={handleRemovePhoto}>
              <Ionicons name="close-circle" size={28} color={colors.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoActionsRow}>
            <TouchableOpacity style={styles.photoActionCard} onPress={handleTakePhoto}>
              <View style={styles.photoIconContainer}>
                <Ionicons name="camera" size={28} color={colors.primary} />
              </View>
              <Text style={styles.photoActionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoActionCard} onPress={handlePickGallery}>
              <View style={styles.photoIconContainer}>
                <Ionicons name="images" size={28} color={colors.primary} />
              </View>
              <Text style={styles.photoActionText}>Upload Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe the problem, nearby landmarks, etc."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xl },
  backButton: { marginRight: spacing.md },
  title: { ...typography.title3, color: colors.text },
  section: { padding: spacing.lg, paddingBottom: 0 },
  label: { ...typography.subhead, color: colors.textSecondary, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  typeCard: { width: '47%', padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  typeCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  typeLabel: { ...typography.caption1, color: colors.textSecondary },
  typeLabelActive: { color: colors.primary, fontWeight: '600' },
  locationCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, gap: spacing.sm },
  locationText: { ...typography.body, color: colors.text },
  photoPlaceholder: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  photoIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary + '10', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  photoText: { ...typography.subhead, color: colors.text, fontWeight: '600' },
  photoSubtext: { ...typography.caption2, color: colors.textSecondary },
  photoActionsRow: { flexDirection: 'row', gap: spacing.md },
  photoActionCard: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  photoActionText: { ...typography.caption1, color: colors.text, fontWeight: '600', textAlign: 'center' },
  photoPreviewContainer: { position: 'relative', marginTop: spacing.sm },
  photoPreview: { width: '100%', height: 200, borderRadius: radius.lg },
  removePhotoButton: { position: 'absolute', top: -10, right: -10, backgroundColor: colors.surface, borderRadius: 14 },
  input: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, color: colors.text, borderWidth: 1, borderColor: colors.border, textAlignVertical: 'top' },
  submitButton: { margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.primary, borderRadius: radius.xl, alignItems: 'center' },
  submitButtonText: { ...typography.headline, color: '#fff' }
});

export default CommunityReport;