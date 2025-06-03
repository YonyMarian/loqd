import { supabase } from './supabase';

// signup (first time)
export async function signUp(email: string, password: string, displayName: string) {
    console.log("fn called");
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: displayName }
        }
    });
    if (error) {
        if (error.message.includes("already registered")) {
            alert("Error: user already exists");
        }
        else alert("Error signing up: " + error.message);
        return null;
    }
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