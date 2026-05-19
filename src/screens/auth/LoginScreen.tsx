import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { DFText, DFButton, DFInput } from '../../components/common';
import { Colors, Spacing, Radius } from '../../theme';
import { useAuthStore } from '../../store';
import { authService } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = '735071305838-t06qvvaqhjf9o2sbtcae0ogk2npo6jj0.apps.googleusercontent.com';
const REDIRECT_URI = `https://auth.expo.io/@generosotiago/df-construcoes`;

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success' && response.params?.code) {
      handleGoogleCode(response.params.code, request?.codeVerifier);
    }
  }, [response]);

  const handleGoogleCode = async (code: string, codeVerifier?: string) => {
    setGoogleLoading(true);
    try {
      const { data } = await authService.googleAuthCode(code, codeVerifier, REDIRECT_URI);
      await loginWithGoogle(data.token, data.user);
    } catch (err: any) {
      Alert.alert('Erro Google', err?.response?.data?.message || 'Falha na autenticação com Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Informe o e-mail.';
    else if (email.trim() !== 'admin' && !/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido.';
    if (!password.trim()) e.password = 'Informe a senha.';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      const msg = err?.response?.data?.message
        || (err?.code === 'ECONNABORTED' ? 'Tempo esgotado. Verifique sua conexão.' : null)
        || (err?.message?.includes('Network') ? 'Sem conexão com o servidor. Verifique se o backend está rodando.' : null)
        || err?.message
        || 'Verifique suas credenciais e tente novamente.';
      Alert.alert('Acesso negado', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoBg}>
              <DFText variant="largeTitle" color={Colors.white} weight="extrabold">DF</DFText>
            </View>
            <DFText variant="title2" weight="bold" color={Colors.navy} style={styles.brandName}>
              DF Construções
            </DFText>
            <DFText variant="subheadline" color={Colors.textSecondary} center>
              Financeiro Inteligente
            </DFText>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <DFText variant="title3" weight="bold" color={Colors.navy} style={styles.formTitle}>
              Entrar
            </DFText>
            <DFText variant="subheadline" color={Colors.textSecondary} style={styles.formSubtitle}>
              Acesse sua conta para continuar
            </DFText>

            <DFInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon="mail-outline"
              error={errors.email}
              placeholder="seu@email.com"
            />

            <DFInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
              placeholder="Sua senha"
            />

            <DFButton
              label="Entrar"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.loginBtn}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <DFText variant="caption1" color={Colors.textTertiary} style={styles.dividerText}>
                ou continue com
              </DFText>
              <View style={styles.dividerLine} />
            </View>

            {/* Google button */}
            <TouchableOpacity
              style={[styles.googleBtn, (googleLoading || !request) && styles.googleBtnDisabled]}
              onPress={() => promptAsync()}
              disabled={googleLoading || !request}
              activeOpacity={0.8}
            >
              <View style={styles.googleIconWrapper}>
                {/* Google G logo using colored squares */}
                <DFText style={styles.googleG}>G</DFText>
              </View>
              <DFText variant="subheadline" weight="semibold" color={Colors.textPrimary}>
                {googleLoading ? 'Conectando...' : 'Continuar com Google'}
              </DFText>
            </TouchableOpacity>

            {/* Config note */}
            {GOOGLE_WEB_CLIENT_ID.includes('SEU_') && (
              <View style={styles.configNote}>
                <Ionicons name="information-circle-outline" size={14} color={Colors.warning} />
                <DFText variant="caption2" color={Colors.warning} style={{ flex: 1 }}>
                  Configure o Google Client ID em LoginScreen.tsx para ativar o login com Google.
                </DFText>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <DFText variant="caption1" color={Colors.textTertiary} center>
              Estruturas Fortes, Construção Confiável.
            </DFText>
            <DFText variant="caption2" color={Colors.textDisabled} center style={{ marginTop: 4 }}>
              v1.0.0 · Jaraguá do Sul / SC
            </DFText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  brandName: { marginBottom: 4 },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: Spacing.lg,
  },
  formTitle: { marginBottom: 4 },
  formSubtitle: { marginBottom: Spacing.lg },
  loginBtn: { marginTop: Spacing.sm },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grayBorder,
  },
  dividerText: { paddingHorizontal: 4 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.grayBorder,
    backgroundColor: Colors.white,
  },
  googleBtnDisabled: { opacity: 0.5 },
  googleIconWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 4,
  },
  googleG: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  configNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
});
