// Helper script to set points for demo@ecobank.id user to 1,000,000
// Run this in browser console to add points
export function setDemoUserPoints() {
  const userId = "demo_user_1"; // id of demo@ecobank.id user
  const pointsToSet = 1000000;
  
  try {
    // Set points in localStorage with userId key
    localStorage.setItem(`ecobank_points_${userId}`, String(pointsToSet));
    console.log(`✅ Points set to ${pointsToSet.toLocaleString()} for user ${userId}`);
    
    // Also update in user object if exists
    const usersData = localStorage.getItem("ecobank_users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const user = users.find((u: any) => u.id === userId);
      if (user) {
        user.points = pointsToSet;
        localStorage.setItem("ecobank_users", JSON.stringify(users));
        console.log(`✅ Also updated points in user object`);
      }
    }
    
    // If user is currently logged in, update currentUser too
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === userId) {
        user.points = pointsToSet;
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log(`✅ Updated current logged-in user points`);
        // Reload page to see changes
        window.location.reload();
      }
    }
  } catch (e) {
    console.error("Error setting points:", e);
  }
}

// Also export for direct call
if (typeof window !== 'undefined') {
  (window as any).setDemoUserPoints = setDemoUserPoints;
}
