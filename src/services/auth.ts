import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_SESSION_KEY = '@QuitMinder:userSession';

export interface AuthUser {
    id: string;
    email?: string;
}

export async function signUp(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { user: null, error };
        }

        if (data.user) {
            const user: AuthUser = {
                id: data.user.id,
                email: data.user.email,
            };
            
            // Salvar sessão
            await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
            
            return { user, error: null };
        }

        return { user: null, error: new Error("Falha ao criar conta") };
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        return { user: null, error: error as Error };
    }
}

export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { user: null, error };
        }

        if (data.user) {
            const user: AuthUser = {
                id: data.user.id,
                email: data.user.email,
            };
            
            // Salvar sessão
            await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
            
            return { user, error: null };
        }

        return { user: null, error: new Error("Falha ao fazer login") };
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return { user: null, error: error as Error };
    }
}

export async function signOut(): Promise<void> {
    try {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem(USER_SESSION_KEY);
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        throw error;
    }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        // Verificar sessão no Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            const authUser: AuthUser = {
                id: user.id,
                email: user.email,
            };
            
            // Atualizar sessão salva
            await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(authUser));
            
            return authUser;
        }

        // Tentar recuperar do AsyncStorage
        const saved = await AsyncStorage.getItem(USER_SESSION_KEY);
        if (saved) {
            return JSON.parse(saved);
        }

        return null;
    } catch (error) {
        console.error("Erro ao obter usuário atual:", error);
        return null;
    }
}

export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}

