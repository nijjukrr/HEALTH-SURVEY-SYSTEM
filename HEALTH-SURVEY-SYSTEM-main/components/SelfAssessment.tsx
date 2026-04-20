import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Animated,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface Question {
    id: string;
    text: string;
    options: { label: string; value: string; score: number }[];
}

const questions: Question[] = [
    {
        id: 'symptoms_diarrhea',
        text: 'Are you experiencing diarrhea or loose stools?',
        options: [
            { label: 'No', value: 'no', score: 0 },
            { label: 'Mild (1-2 times/day)', value: 'mild', score: 1 },
            { label: 'Severe (3+ times/day)', value: 'severe', score: 3 },
        ],
    },
    {
        id: 'symptoms_vomiting',
        text: 'Do you have nausea or vomiting?',
        options: [
            { label: 'No', value: 'no', score: 0 },
            { label: 'Occasional', value: 'mild', score: 1 },
            { label: 'Frequent', value: 'severe', score: 2 },
        ],
    },
    {
        id: 'symptoms_fever',
        text: 'Do you have a fever?',
        options: [
            { label: 'No fever', value: 'no', score: 0 },
            { label: 'Low grade (37-38°C)', value: 'low', score: 1 },
            { label: 'High fever (>38°C)', value: 'high', score: 3 },
        ],
    },
    {
        id: 'symptoms_other',
        text: 'Are you experiencing any of the following?',
        options: [
            { label: 'None', value: 'none', score: 0 },
            { label: 'Abdominal cramps', value: 'cramps', score: 1 },
            { label: 'Jaundice (yellowing)', value: 'jaundice', score: 3 },
            { label: 'Dehydration signs', value: 'dehydration', score: 3 },
        ],
    },
    {
        id: 'water_source',
        text: 'What is your primary drinking water source?',
        options: [
            { label: 'Treated municipal/RO', value: 'treated', score: 0 },
            { label: 'Borewell/handpump', value: 'borewell', score: 1 },
            { label: 'River/pond/untreated', value: 'untreated', score: 3 },
        ],
    },
    {
        id: 'flooding',
        text: 'Has there been recent flooding in your area?',
        options: [
            { label: 'No', value: 'no', score: 0 },
            { label: 'Minor waterlogging', value: 'minor', score: 1 },
            { label: 'Yes, significant flooding', value: 'major', score: 2 },
        ],
    },
    {
        id: 'contact',
        text: 'Have you been in contact with someone diagnosed with a water-borne illness?',
        options: [
            { label: 'No', value: 'no', score: 0 },
            { label: 'Not sure', value: 'unsure', score: 1 },
            { label: 'Yes', value: 'yes', score: 3 },
        ],
    },
    {
        id: 'sanitation',
        text: 'How is the sanitation condition near your water source?',
        options: [
            { label: 'Good / Covered drainage', value: 'good', score: 0 },
            { label: 'Average', value: 'average', score: 1 },
            { label: 'Poor / Open drains nearby', value: 'poor', score: 3 },
        ],
    },
];

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

const getRiskResult = (score: number): { level: RiskLevel; color: string; title: string; advice: string } => {
    if (score <= 3) return {
        level: 'low', color: '#34C759', title: 'Low Risk',
        advice: 'Your risk of water-borne illness is low. Continue using safe water sources and maintain hygiene practices.',
    };
    if (score <= 7) return {
        level: 'moderate', color: '#FF9500', title: 'Moderate Risk',
        advice: 'You have some risk factors. Ensure you boil or treat your drinking water and wash hands frequently. Monitor for symptoms.',
    };
    if (score <= 12) return {
        level: 'high', color: '#FF6B35', title: 'High Risk',
        advice: 'Your risk is elevated. Please visit a health center for a check-up. Use only treated water and ORS if experiencing diarrhea.',
    };
    return {
        level: 'critical', color: '#FF3B30', title: 'Critical Risk',
        advice: 'Seek medical attention immediately. You may have a water-borne infection. Visit the nearest hospital or call the helpline.',
    };
};

interface SelfAssessmentProps {
    onComplete?: (riskLevel: RiskLevel, score: number) => void;
    onClose?: () => void;
}

const SelfAssessment: React.FC<SelfAssessmentProps> = ({ onComplete, onClose }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showResult, setShowResult] = useState(false);

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const result = getRiskResult(totalScore);
    const progress = (currentStep / questions.length) * 100;

    const handleAnswer = useCallback((questionId: string, score: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: score }));
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowResult(true);
            onComplete?.(getRiskResult(totalScore + score).level, totalScore + score);
        }
    }, [currentStep, totalScore, onComplete]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    }, [currentStep]);

    const handleRestart = useCallback(() => {
        setCurrentStep(0);
        setAnswers({});
        setShowResult(false);
    }, []);

    const handleCallHelpline = useCallback(() => {
        Linking.openURL('tel:104'); // Standard health helpline
    }, []);

    const handleFindLab = useCallback(() => {
        Linking.openURL('https://www.google.com/maps/search/nearby+hospital+clinic+or+lab');
    }, []);

    if (showResult) {
        const finalResult = getRiskResult(Object.values(answers).reduce((a, b) => a + b, 0));
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Assessment Result</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.resultContainer}>
                    <View style={[styles.resultBadge, { backgroundColor: finalResult.color }]}>
                        <Ionicons
                            name={finalResult.level === 'low' ? 'checkmark' : 'warning'}
                            size={40}
                            color="#FFFFFF"
                        />
                    </View>
                    <Text style={[styles.resultTitle, { color: finalResult.color }]}>{finalResult.title}</Text>
                    <Text style={styles.resultScore}>Risk Score: {Object.values(answers).reduce((a, b) => a + b, 0)}/24</Text>
                    <View style={styles.adviceCard}>
                        <Text style={styles.adviceTitle}>Recommendation</Text>
                        <Text style={styles.adviceText}>{finalResult.advice}</Text>
                    </View>

                    {finalResult.level !== 'low' && (
                        <View style={styles.actionCards}>
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: finalResult.color }]}
                                activeOpacity={0.7}
                                onPress={handleCallHelpline}
                            >
                                <Text style={styles.actionBtnText}>
                                    <Ionicons name="call" size={16} color="#FFFFFF" /> Call Helpline
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                                activeOpacity={0.7}
                                onPress={handleFindLab}
                            >
                                <Text style={styles.actionBtnText}>
                                    <Ionicons name="medkit" size={16} color="#FFFFFF" /> Find Nearby Lab
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity style={styles.retakeBtn} onPress={handleRestart} activeOpacity={0.6}>
                        <Text style={styles.retakeBtnText}>Retake Assessment</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    const question = questions[currentStep];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={currentStep === 0 ? onClose : handleBack} activeOpacity={0.6}>
                    <Ionicons name={currentStep === 0 ? 'close' : 'chevron-back'} size={24} color={colors.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Self-Assessment</Text>
                <Text style={styles.stepText}>{currentStep + 1}/{questions.length}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionLabel}>Question {currentStep + 1}</Text>
                <Text style={styles.questionText}>{question.text}</Text>

                <View style={styles.optionsContainer}>
                    {question.options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.optionButton,
                                answers[question.id] === option.score && styles.optionButtonSelected,
                            ]}
                            onPress={() => handleAnswer(question.id, option.score)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    answers[question.id] === option.score && styles.optionTextSelected,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: 'transparent' },
        header: {
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingTop: spacing.xxl,
        },
        closeText: { fontSize: 20, color: colors.textSecondary, fontWeight: '300' },
        headerTitle: { ...typography.headline, color: colors.text },
        stepText: { ...typography.footnote, color: colors.textSecondary },
        progressBar: {
            height: 4, backgroundColor: colors.surfaceVariant,
            marginHorizontal: spacing.xl, borderRadius: 2, overflow: 'hidden',
        },
        progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
        questionContainer: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
        questionLabel: { ...typography.caption1, color: colors.primary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
        questionText: { ...typography.title2, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.xxl },
        optionsContainer: { gap: spacing.md },
        optionButton: {
            paddingVertical: spacing.lg, paddingHorizontal: spacing.xl,
            borderRadius: radius.xl, backgroundColor: colors.glass,
            borderWidth: 1, borderColor: colors.glassBorder,
        },
        optionButtonSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '20' },
        optionText: { ...typography.callout, color: colors.text },
        optionTextSelected: { color: colors.primary, fontWeight: '600' },
        resultContainer: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
        resultBadge: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
        resultIcon: { fontSize: 36, color: '#FFFFFF' },
        resultTitle: { ...typography.title1, marginBottom: spacing.sm },
        resultScore: { ...typography.subhead, color: colors.textSecondary, marginBottom: spacing.xxl },
        adviceCard: {
            backgroundColor: colors.glass, borderRadius: radius.xl, padding: spacing.xl,
            borderWidth: 1, borderColor: colors.glassBorder, width: '100%',
        },
        adviceTitle: { ...typography.headline, color: colors.text, marginBottom: spacing.sm },
        adviceText: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
        actionCards: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, width: '100%' },
        actionBtn: { flex: 1, paddingVertical: spacing.lg, borderRadius: radius.lg, alignItems: 'center' },
        actionBtnText: { ...typography.callout, color: '#FFFFFF', fontWeight: '600' },
        retakeBtn: { marginTop: spacing.xl, paddingVertical: spacing.md },
        retakeBtnText: { ...typography.callout, color: colors.primary, fontWeight: '600' },
    });

export default React.memo(SelfAssessment);
