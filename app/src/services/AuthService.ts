import axios from "axios";
import { API_URL_AUTH } from "../config";
import { useSignIn } from "@clerk/clerk-expo";

interface AuthResponse {
    token?: string;
    message?: string;
}

export const signUp = async (email: string, password: string): Promise<AuthResponse | null> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL_AUTH}/signup`, { email, password });
        return response.data;
    } catch (error: any) {
        console.error("Erreur Signup :", error.response?.data || error.message);
        return null;
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL_AUTH}/login`, { email, password });
        const { userId } = response.data;

        const { signIn, setActive } = useSignIn();
        if (!signIn) {
            throw new Error("signIn is undefined");
        }
        const signInAttempt = await signIn.create({
            identifier: email,
            password,
        });

        if (signInAttempt.status === "complete") {
            await setActive({ session: signInAttempt.createdSessionId });
            return { success: true, userId };
        } else {
            return { success: false, error: "Erreur lors de l'authentification Clerk." };
        }
    } catch (error: any) {
        console.error("❌ Erreur Login :", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

// Ajout d'un export par défaut vide pour éviter que Metro ne le traite comme un écran
export default {};
