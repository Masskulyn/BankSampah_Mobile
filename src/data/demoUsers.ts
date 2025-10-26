// Demo users for testing
export const initializeDemoUsers = async () => {
  const existingUsers = localStorage.getItem("ecobank_users");
  if (existingUsers) return; // Don't overwrite existing data

  // Hash function for demo passwords
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "ecobank_salt");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const demoUsers = [
    {
      id: "admin_001",
      name: "Admin EcoBank",
      email: "admin@ecobank.id",
      phone: "+62 811-0000-0001",
      city: "Jakarta Pusat",
      password: await hashPassword("admin123"),
      createdAt: "2024-01-01T00:00:00.000Z",
      lastLogin: new Date().toISOString(),
      balance: 0,
      totalEarnings: 0,
      wasteDeposited: 0,
      role: "admin"
    },
    {
      id: "demo_user_1",
      name: "Anggit Ganteng",
      email: "demo@ecobank.id",
      phone: "+62 812-3456-7890",
      city: "Jakarta Selatan",
      password: await hashPassword("demo123"),
      createdAt: "2024-01-15T08:00:00.000Z",
      lastLogin: new Date().toISOString(),
      balance: 125000,
      totalEarnings: 450000,
      wasteDeposited: 25,
      role: "user"
    },
    {
      id: "demo_user_2", 
      name: "Siti Nurhaliza",
      email: "siti@ecobank.id",
      phone: "+62 821-9876-5432",
      city: "Jakarta Pusat",
      password: await hashPassword("siti123"),
      createdAt: "2024-02-20T10:30:00.000Z",
      lastLogin: "2024-10-03T15:45:00.000Z",
      balance: 89000,
      totalEarnings: 275000,
      wasteDeposited: 18,
      role: "user"
    },
    {
      id: "demo_user_3",
      name: "Budi Santoso",
      email: "budi@ecobank.id", 
      phone: "+62 813-5555-1234",
      city: "Tangerang",
      password: await hashPassword("budi123"),
      createdAt: "2024-03-10T14:20:00.000Z",
      lastLogin: "2024-10-02T09:15:00.000Z",
      balance: 205000,
      totalEarnings: 680000,
      wasteDeposited: 42,
      role: "user"
    }
  ];

  localStorage.setItem("ecobank_users", JSON.stringify(demoUsers));
  console.log("Demo users initialized");
};

// Initialize demo users when this module is imported
initializeDemoUsers();