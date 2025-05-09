// api/auth.js

// Mock user database
const mockUsers = [
  {
    id: 1,
    name: "President User",
    email: "president@softtec.org",
    password: "password123", // In real app, this would be hashed
    role: "President",
  },
  {
    id: 2,
    name: "VP User",
    email: "vp@softtec.org",
    password: "password123",
    role: "VP",
  },
  // Add other roles as needed
];

// Helper function to simulate network delay
const simulateNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 500));

export default {
  async login(email, password) {
    await simulateNetworkDelay(); // Simulate network latency

    // Find user in mock database
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Simulate successful API response
    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        role: user.role,
        token: "mock-jwt-token-for-testing",
      },
    };
  },

  // Add other mock methods as needed
  async getCurrentUser(token) {
    await simulateNetworkDelay();

    if (token !== "mock-jwt-token-for-testing") {
      throw new Error("Invalid token");
    }

    // Return the first user as "current" user for testing
    const user = mockUsers[0];
    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  },
};
