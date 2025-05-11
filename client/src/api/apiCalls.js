import axiosInstance from "../config/axios";

const auth = {
  login: async (email, password) => {
    return axiosInstance.post("/auth/login", { email, password });
  },

  verifyMfa: async (userId, code) => {
    return axiosInstance.post("/auth/verify-mfa", { userId, code });
  },

  getMe: async () => {
    return axiosInstance.get("/auth/me");
  },

  setupMfa: async () => {
    return axiosInstance.post("/auth/setup-mfa");
  },

  disableMfa: async (code) => {
    return axiosInstance.post("/auth/disable-mfa", { code });
  },

  logout: async () => {
    return axiosInstance.post("/auth/logout");
  },
};

const user = {
  updateProfile: async (userId, profileData) => {
    return axiosInstance.put(`/users/${userId}`, profileData);
  },

  getProfile: async (userId) => {
    return axiosInstance.get(`/users/${userId}`);
  },

  updatePassword: async (currentPassword, newPassword) => {
    return axiosInstance.put("/users/update-password", {
      currentPassword,
      newPassword,
    });
  },

  // Get users by role
  getUsersByRole: async (role) => {
    return axiosInstance.get(`/users/by-role/${role}`);
  },

  // Create new user
  createUser: async (userData) => {
    return axiosInstance.post("/users", userData);
  },

  // Delete user
  deleteUser: async (userId) => {
    return axiosInstance.delete(`/users/${userId}`);
  },
};

const competition = {
  getAll: async () => {
    return axiosInstance.get("/competitions");
  },

  getById: async (id) => {
    return axiosInstance.get(`/competitions/${id}`);
  },

  create: async (competitionData) => {
    return axiosInstance.post("/competitions", competitionData);
  },

  update: async (id, competitionData) => {
    return axiosInstance.put(`/competitions/${id}`, competitionData);
  },

  delete: async (id) => {
    return axiosInstance.delete(`/competitions/${id}`);
  },

  // Get competition registrations
  getRegistrations: async (id) => {
    return axiosInstance.get(`/competitions/${id}/registrations`);
  },

  // Get competition results
  getResults: async (id) => {
    return axiosInstance.get(`/competitions/${id}/results`);
  },

  // Get competition participants
  getParticipants: async (id) => {
    return axiosInstance.get(`/competitions/${id}/participants`);
  },

  // Get competition teams
  getTeams: async (id) => {
    return axiosInstance.get(`/competitions/${id}/teams`);
  },

  // Confirm team payment
  confirmTeamPayment: async (registrationId, paymentProofUrl) => {
    return axiosInstance.put(
      `/competitions/registrations/${registrationId}/confirm-payment`,
      { paymentProofUrl }
    );
  },
};

const participation = {
  // Get all competitions for public view
  getAllPublicCompetitions: async () => {
    return axiosInstance.get("/competitions/public");
  },

  // Get single competition details for public view
  getPublicCompetitionById: async (id) => {
    return axiosInstance.get(`/competitions/public/${id}`);
  },

  registerTeam: async (teamData) => {
    return axiosInstance.post(
      `/competitions/${teamData.competitionId}/register`,
      {
        teamName: teamData.teamName,
        participants: teamData.participants,
      }
    );
  },
};

const recruitment = {
  // Get all applications
  getApplications: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return axiosInstance.get(`/recruitment/applications?${queryParams}`);
  },

  // Get single application
  getApplication: async (id) => {
    return axiosInstance.get(`/recruitment/applications/${id}`);
  },

  // Update application status
  updateApplicationStatus: async (id, statusData) => {
    return axiosInstance.put(
      `/recruitment/applications/${id}/status`,
      statusData
    );
  },

  // Delete application
  deleteApplication: async (id) => {
    return axiosInstance.delete(`/recruitment/applications/${id}`);
  },

  // Submit new application
  submitApplication: async (applicationData) => {
    return axiosInstance.post("/recruitment/apply", applicationData);
  },
};

const api = {
  auth,
  user,
  competition,
  participation,
  recruitment,
};

export default api;
