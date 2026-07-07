export const operationsSnapshot = {
  cafeName: "Backyard Brew Cafe",
  plan: "Advanced",
  today: {
    revenue: "Rs. 42,860",
    reservations: 18,
    walkIns: 64,
    avgOrder: "Rs. 410"
  },
  reservations: [
    {
      guest: "Aarav Mehta",
      time: "10:00 AM",
      partySize: 3,
      status: "Confirmed",
      source: "Website"
    },
    {
      guest: "Nisha Rao",
      time: "11:30 AM",
      partySize: 2,
      status: "Pending",
      source: "WhatsApp"
    },
    {
      guest: "Kabir Singh",
      time: "1:00 PM",
      partySize: 5,
      status: "Confirmed",
      source: "QR"
    },
    {
      guest: "Meera Iyer",
      time: "6:30 PM",
      partySize: 4,
      status: "Confirmed",
      source: "Website"
    }
  ],
  customers: [
    {
      name: "Aarav Mehta",
      visits: 12,
      spend: "Rs. 8,420",
      segment: "Loyal"
    },
    {
      name: "Nisha Rao",
      visits: 4,
      spend: "Rs. 2,160",
      segment: "Growing"
    },
    {
      name: "Kabir Singh",
      visits: 7,
      spend: "Rs. 5,740",
      segment: "Regular"
    }
  ],
  menuHealth: [
    {
      item: "Salted Caramel Cold Brew",
      sold: 36,
      trend: "+18%"
    },
    {
      item: "Garden Pesto Sandwich",
      sold: 24,
      trend: "+9%"
    },
    {
      item: "Cocoa Hazelnut Waffle",
      sold: 19,
      trend: "-3%"
    }
  ],
  tasks: [
    "Confirm pending WhatsApp booking",
    "Upload weekend event poster",
    "Review low-stock dessert ingredients",
    "Send loyalty coupon to regular guests"
  ]
};

export type OperationsSnapshot = typeof operationsSnapshot;
