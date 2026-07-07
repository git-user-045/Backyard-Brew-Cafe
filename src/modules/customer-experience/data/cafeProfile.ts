export const cafeProfile = {
  name: "Backyard Brew Cafe",
  tagline: "Neighborhood coffee, slow mornings, and table-ready service.",
  description:
    "A warm public website foundation for CafeOS clients, built to grow into QR menus, reservations, loyalty, and owner dashboards without rebuilding the front end.",
  address: "Civil Lines, Jaipur, Rajasthan",
  phone: "+91 98765 43210",
  whatsapp: "https://wa.me/919876543210",
  email: "hello@backyardbrew.example",
  hours: "8:00 AM - 11:00 PM",
  stats: [
    { value: "42", label: "signature drinks" },
    { value: "18", label: "tables managed" },
    { value: "4.8", label: "guest rating" },
    { value: "7", label: "days open" }
  ],
  featuredMenu: [
    {
      name: "Salted Caramel Cold Brew",
      category: "Coffee",
      price: "Rs. 210",
      description: "Slow-steeped house cold brew with caramel, sea salt, and cream.",
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85"
    },
    {
      name: "Garden Pesto Sandwich",
      category: "Kitchen",
      price: "Rs. 260",
      description: "Toasted sourdough, herbed pesto, grilled vegetables, and mozzarella.",
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85"
    },
    {
      name: "Cocoa Hazelnut Waffle",
      category: "Dessert",
      price: "Rs. 240",
      description: "Crisp waffle, cocoa drizzle, roasted hazelnuts, and vanilla cream.",
      image:
        "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=85"
    }
  ],
  availableSlots: ["10:00 AM", "11:30 AM", "1:00 PM", "4:00 PM", "6:30 PM", "8:00 PM"],
  gallery: [
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85"
  ]
};

export type CafeProfile = typeof cafeProfile;
