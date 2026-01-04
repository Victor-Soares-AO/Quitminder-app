import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { AppState, AppStateStatus } from "react-native";

const PRIVACY_LOCK_COLLECTION = '@QuitMinder:privacyLock';
const LAST_UNLOCK_TIME = '@QuitMinder:lastUnlockTime';

type PrivacyLockContextData = {
    isLocked: boolean;
    isEnabled: boolean;
    setIsEnabled: (enabled: boolean) => Promise<void>;
    authenticate: () => Promise<boolean>;
    lock: () => void;
    unlock: () => void;
    checkBiometricSupport: () => Promise<boolean>;
};

const PrivacyLockContext = createContext<PrivacyLockContextData>({
    isLocked: false,
    isEnabled: false,
    setIsEnabled: async () => {},
    authenticate: async () => false,
    lock: () => {},
    unlock: () => {},
    checkBiometricSupport: async () => false,
});

export function PrivacyLockProvider({ children }: { children: ReactNode }) {
    const [isLocked, setIsLocked] = useState(false);
    const [isEnabled, setIsEnabledState] = useState(false);
    const appState = useRef<AppStateStatus>(AppState.currentState);
    const hasCheckedInitialLock = useRef(false);

    useEffect(() => {
        loadPrivacyLockStatus();
    }, []);

    useEffect(() => {
        if (!isEnabled) {
            setIsLocked(false);
            hasCheckedInitialLock.current = false;
            return;
        }

        // Verificar bloqueio quando o app volta do background
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        
        // Verificar bloqueio inicial apenas uma vez quando o bloqueio é habilitado
        if (!hasCheckedInitialLock.current) {
            checkAndLockOnAppStart();
            hasCheckedInitialLock.current = true;
        }

        return () => {
            subscription.remove();
        };
    }, [isEnabled]);

    const loadPrivacyLockStatus = async () => {
        try {
            const saved = await AsyncStorage.getItem(PRIVACY_LOCK_COLLECTION);
            if (saved === 'true') {
                setIsEnabledState(true);
                // Quando o bloqueio está habilitado e o app é carregado, sempre bloquear
                checkAndLockOnAppStart();
                hasCheckedInitialLock.current = true;
            }
        } catch (error) {
            console.error("Erro ao carregar status do bloqueio:", error);
        }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        const previousState = appState.current;
        appState.current = nextAppState;
        
        // Só verificar bloqueio quando o app volta do background/inactive para active
        // Não verificar se o app já estava ativo (para evitar bloqueios desnecessários durante navegação)
        if (nextAppState === 'active' && isEnabled && (previousState === 'background' || previousState === 'inactive')) {
            checkAndLockOnBackgroundReturn();
        }
    };

    const checkAndLockOnAppStart = async () => {
        try {
            const lastUnlock = await AsyncStorage.getItem(LAST_UNLOCK_TIME);
            const now = Date.now();
            
            // Se não há registro de desbloqueio, bloquear (primeira vez abrindo o app)
            if (!lastUnlock) {
                setIsLocked(true);
            } else {
                // Se há registro mas passou mais de 5 segundos, bloquear
                // Isso garante que se o app foi fechado e reaberto, vai bloquear
                const timeSinceUnlock = now - parseInt(lastUnlock);
                if (timeSinceUnlock > 5000) {
                    setIsLocked(true);
                } else {
                    // Se foi desbloqueado recentemente (menos de 5 segundos), manter desbloqueado
                    setIsLocked(false);
                }
            }
        } catch (error) {
            console.error("Erro ao verificar bloqueio:", error);
            setIsLocked(true);
        }
    };

    const checkAndLockOnBackgroundReturn = async () => {
        try {
            const lastUnlock = await AsyncStorage.getItem(LAST_UNLOCK_TIME);
            const now = Date.now();
            
            // Se não há registro de desbloqueio ou passou mais de 5 segundos desde o último desbloqueio, bloquear
            if (!lastUnlock || (now - parseInt(lastUnlock)) > 5000) {
                setIsLocked(true);
            }
            // Se foi desbloqueado recentemente (menos de 5 segundos), não bloquear
        } catch (error) {
            console.error("Erro ao verificar bloqueio:", error);
            setIsLocked(true);
        }
    };

    const setIsEnabled = async (enabled: boolean) => {
        try {
            await AsyncStorage.setItem(PRIVACY_LOCK_COLLECTION, enabled ? 'true' : 'false');
            setIsEnabledState(enabled);
            if (!enabled) {
                setIsLocked(false);
            }
        } catch (error) {
            console.error("Erro ao salvar status do bloqueio:", error);
            throw error;
        }
    };

    const checkBiometricSupport = async (): Promise<boolean> => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) return false;

            const enrolled = await LocalAuthentication.isEnrolledAsync();
            return enrolled;
        } catch (error) {
            console.error("Erro ao verificar suporte biométrico:", error);
            return false;
        }
    };

    const authenticate = async (): Promise<boolean> => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) {
                return false;
            }

            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) {
                return false;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Desbloquear aplicativo',
                cancelLabel: 'Cancelar',
                disableDeviceFallback: false,
                fallbackLabel: 'Usar senha do dispositivo',
            });

            if (result.success) {
                await AsyncStorage.setItem(LAST_UNLOCK_TIME, Date.now().toString());
                setIsLocked(false);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Erro na autenticação:", error);
            return false;
        }
    };

    const lock = () => {
        setIsLocked(true);
    };

    const unlock = () => {
        setIsLocked(false);
    };

    return (
        <PrivacyLockContext.Provider
            value={{
                isLocked,
                isEnabled,
                setIsEnabled,
                authenticate,
                lock,
                unlock,
                checkBiometricSupport,
            }}
        >
            {children}
        </PrivacyLockContext.Provider>
    );
}

export function usePrivacyLock() {
    return useContext(PrivacyLockContext);
}

