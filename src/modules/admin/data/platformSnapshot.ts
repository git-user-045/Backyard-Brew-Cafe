export const platformSnapshot = {
  summary: {
    activeClients: 24,
    monthlyRevenue: "Rs. 1.86L",
    openIssues: 7,
    churnRisk: 3
  },
  clients: [
    {
      cafe: "Backyard Brew Cafe",
      owner: "Rohan Sharma",
      city: "Jaipur",
      plan: "Advanced",
      status: "Healthy",
      mrr: "Rs. 4,999",
      reservations: 186,
      lastActive: "12 min ago"
    },
    {
      cafe: "Urban Beans",
      owner: "Ananya Kapoor",
      city: "Delhi",
      plan: "Premium",
      status: "Needs attention",
      mrr: "Rs. 8,999",
      reservations: 322,
      lastActive: "1 hr ago"
    },
    {
      cafe: "Brew Haven",
      owner: "Imran Khan",
      city: "Pune",
      plan: "Basic",
      status: "Setup",
      mrr: "Rs. 2,999",
      reservations: 48,
      lastActive: "Yesterday"
    },
    {
      cafe: "Coffee Corner",
      owner: "Priya Nair",
      city: "Bengaluru",
      plan: "Advanced",
      status: "Healthy",
      mrr: "Rs. 4,999",
      reservations: 214,
      lastActive: "25 min ago"
    }
  ],
  supportQueue: [
    {
      client: "Urban Beans",
      issue: "WhatsApp booking webhook delayed",
      priority: "High"
    },
    {
      client: "Brew Haven",
      issue: "Domain DNS verification pending",
      priority: "Medium"
    },
    {
      client: "Coffee Corner",
      issue: "Menu image upload failed",
      priority: "Low"
    }
  ],
  onboarding: [
    {
      client: "Brew Haven",
      progress: 72,
      nextStep: "Connect domain"
    },
    {
      client: "The Daily Roast",
      progress: 45,
      nextStep: "Upload menu"
    },
    {
      client: "Mocha Yard",
      progress: 28,
      nextStep: "Collect photos"
    }
  ],
  planMix: [
    { plan: "Basic", count: 8 },
    { plan: "Advanced", count: 11 },
    { plan: "Premium", count: 5 }
  ]
};

export type PlatformSnapshot = typeof platformSnapshot;
