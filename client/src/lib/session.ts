import { supabase } from './supabase';

// signup (first time)
export async function signup(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: displayName}
        }
    });
    if (error) {
        alert("Error signing up: " + error.message);
        return null;
    }
    console.log(data);
    return data;
}

// signin (returning)
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password});
    if (error) {
        alert("Error signing in: " + error.message);
        return null;
    }
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert("Error signing out: " + error.message);
        return null;
    }
}