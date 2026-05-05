import { create } from "zustand";
const initialState = {
    loginForm: {
        email: "",
        password: "",
    },
    registerForm: {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        mailingAddress: "",
        billingAddress: "",
        billingSameAsMailing: false,
        preferredPayment: "",
    },
    loading: false,
    error: null,
    token: null,
    user: null,
    isAuthenticated: false,
};
export const useAuthStore = create()((set) => ({
    ...initialState,
    setLoginField: (field, value) => set((state) => ({
        loginForm: {
            ...state.loginForm,
            [field]: value,
        },
    })),
    setRegisterField: (field, value) => set((state) => ({
        registerForm: {
            ...state.registerForm,
            [field]: value,
        },
    })),
    setLoading: (value) => set(() => ({
        loading: value,
    })),
    setError: (message) => set(() => ({
        error: message,
    })),
    loginSuccess: (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set(() => ({
            token,
            user,
            isAuthenticated: true,
            error: null,
        }));
    },
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set(() => ({
            ...initialState,
        }));
    },
    resetLoginForm: () => set((state) => ({
        ...state,
        loginForm: initialState.loginForm,
        loading: false,
        error: null,
    })),
    resetRegisterForm: () => set((state) => ({
        ...state,
        registerForm: initialState.registerForm,
        loading: false,
        error: null,
    })),
}));
