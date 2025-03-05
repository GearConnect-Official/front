import axios from "axios";
import { API_URL_AUTH } from "../config";
import { useSignIn } from "@clerk/clerk-expo";

interface AuthResponse {
    token?: string;
    message?: string;
}

export const signUp = async (username: string, email: string, password: string): Promise<AuthResponse | null> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL_AUTH}/signup`, {username, email, password });
        return response.data;
    } catch (error: any) {
        console.error("Signup Error:", error.response?.data || error.message);
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
            return { success: false, error: "Clerk authentication failed." };
        }
    } catch (error: any) {
        console.error("❌ Login Error:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

// Empty default export to prevent Metro from treating this as a screen
export default {};
