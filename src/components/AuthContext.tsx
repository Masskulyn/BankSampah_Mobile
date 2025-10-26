import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
  lastLogin: string;
  balance: number;
  totalEarnings: number;
  wasteDeposited: number;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  city: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("currentUser");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const hashPassword = async (password: string): Promise<string> => {
    // Simple hash for demo - in production use proper crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "ecobank_salt");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from localStorage
      const usersData = localStorage.getItem("ecobank_users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Hash the input password
      const hashedPassword = await hashPassword(password);

      // Find user
      const foundUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword
      );

      if (foundUser) {
        // Update last login
        foundUser.lastLogin = new Date().toISOString();
        
        // Update users array
        const updatedUsers = users.map((u: any) => 
          u.id === foundUser.id ? foundUser : u
        );
        localStorage.setItem("ecobank_users", JSON.stringify(updatedUsers));

        // Set auth state
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);

        // Store auth token and current user
        const token = generateId();
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

        toast.success(`Selamat datang kembali, ${foundUser.name}! 🎉`);
        return true;
      } else {
        toast.error("Email atau password salah!");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan saat login. Silakan coba lagi.");
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = localStorage.getItem("ecobank_users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if email already exists
      const existingUser = users.find((u: any) => 
        u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        toast.error("Email sudah terdaftar! Silakan gunakan email lain.");
        return false;
      }

      // Check if phone already exists
      const existingPhone = users.find((u: any) => u.phone === userData.phone);
      if (existingPhone) {
        toast.error("Nomor telepon sudah terdaftar!");
        return false;
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create new user
      const newUser: User & { password: string } = {
        id: generateId(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        phone: userData.phone,
        city: userData.city,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        balance: 0,
        totalEarnings: 0,
        wasteDeposited: 0,
        role: 'user'
      };

      // Add to users array
      users.push(newUser);
      localStorage.setItem("ecobank_users", JSON.stringify(users));

      // Auto login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);

      // Store auth token and current user
      const token = generateId();
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

      toast.success(`Akun berhasil dibuat! Selamat datang, ${userData.name}! 🎉`);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    toast.success("Berhasil keluar dari aplikasi");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    // Update in localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update in users array
    const usersData = localStorage.getItem("ecobank_users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem("ecobank_users", JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}