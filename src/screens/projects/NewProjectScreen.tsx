import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { DFText, DFInput, DFButton } from '../../components/common';
import { Colors, Spacing, Radius } from '../../theme';
import { useProjectStore } from '../../store';
import { projectTypeLabel, projectStatusLabel } from '../../utils/format';

const TYPES = Object.entries(projectTypeLabel);
const STATUSES = Object.entries(projectStatusLabel);

interface SelectFieldProps {
  label: string;
  value: string;
  options: [string, string][];
  onSelect: (val: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const selected = options.find(([k]) => k === value);

  return (
    <View style={selectStyles.container}>
      <DFText variant="subheadline" weight="medium" color={Colors.textSecondary} style={selectStyles.label}>
        {label}
      </DFText>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity
            style={selectStyles.selector}
            onPress={() => setVisible(true)}
            activeOpacity={0.8}
          >
            <DFText variant="body" color={selected ? Colors.textPrimary : Colors.textDisabled}>
              {selected ? selected[1] : 'Selecionar...'}
            </DFText>
            <Ionicons name="chevron-down" size={16} color={Colors.grayLight} />
          </TouchableOpacity>
        }
      >
        {options.map(([k, v]) => (
          <Menu.Item
            key={k}
            onPress={() => { onSelect(k); setVisible(false); }}
            title={v}
            titleStyle={{ color: value === k ? Colors.navy : Colors.textPrimary }}
          />
        ))}
      </Menu>
    </View>
  );
};

const selectStyles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { marginBottom: 6 },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.grayBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
});

export const NewProjectScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { create } = useProjectStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    client: '',
    address: '',
    description: '',
    type: 'completo',
    status: 'em_andamento',
    budget: '',
    start_date: '',
    estimated_end_date: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nome da obra é obrigatório.';
    if (!form.client.trim()) e.client = 'Nome do cliente é obrigatório.';
    if (!form.budget || isNaN(parseFloat(form.budget))) e.budget = 'Informe o orçamento.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        budget: parseFloat(form.budget.replace(',', '.')),
        address: form.address || undefined,
        description: form.description || undefined,
        start_date: form.start_date || undefined,
        estimated_end_date: form.estimated_end_date || undefined,
        notes: form.notes || undefined,
      };
      await create(payload);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || 'Não foi possível criar a obra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <DFText variant="headline" weight="semibold" color={Colors.navy}>Nova Obra</DFText>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <DFText variant="footnote" weight="semibold" color={Colors.textSecondary} style={styles.sectionLabel}>
            INFORMAÇÕES BÁSICAS
          </DFText>

          <DFInput label="Nome da Obra *" value={form.name} onChangeText={(v) => set('name', v)} placeholder="Ex: Residência Silva" leftIcon="construct-outline" error={errors.name} />
          <DFInput label="Cliente *" value={form.client} onChangeText={(v) => set('client', v)} placeholder="Nome do cliente" leftIcon="person-outline" error={errors.client} />
          <DFInput label="Endereço" value={form.address} onChangeText={(v) => set('address', v)} placeholder="Rua, número - Bairro" leftIcon="location-outline" />

          <SelectField label="Tipo de Obra *" value={form.type} options={TYPES} onSelect={(v) => set('type', v)} />
          <SelectField label="Status *" value={form.status} options={STATUSES} onSelect={(v) => set('status', v)} />

          <DFText variant="footnote" weight="semibold" color={Colors.textSecondary} style={styles.sectionLabel}>
            FINANCEIRO
          </DFText>

          <DFInput
            label="Orçamento Total (R$) *"
            value={form.budget}
            onChangeText={(v) => set('budget', v)}
            keyboardType="decimal-pad"
            placeholder="0,00"
            leftIcon="cash-outline"
            error={errors.budget}
          />

          <DFText variant="footnote" weight="semibold" color={Colors.textSecondary} style={styles.sectionLabel}>
            DATAS
          </DFText>

          <DFInput label="Data de Início" value={form.start_date} onChangeText={(v) => set('start_date', v)} placeholder="AAAA-MM-DD" leftIcon="calendar-outline" />
          <DFInput label="Previsão de Conclusão" value={form.estimated_end_date} onChangeText={(v) => set('estimated_end_date', v)} placeholder="AAAA-MM-DD" leftIcon="calendar-clear-outline" />

          <DFInput label="Descrição / Observações" value={form.notes} onChangeText={(v) => set('notes', v)} placeholder="Detalhes do serviço..." multiline numberOfLines={3} leftIcon="document-text-outline" />

          <DFButton label="Criar Obra" onPress={handleSubmit} loading={loading} fullWidth size="lg" style={styles.submitBtn} />
          <View style={{ height: Spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  sectionLabel: { marginBottom: Spacing.sm, marginTop: Spacing.sm, letterSpacing: 0.5 },
  submitBtn: { marginTop: Spacing.md },
});
