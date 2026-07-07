import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Create an owner user (password: "password123" for testing)
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@backyardbrew.com' },
    update: {},
    create: {
      name: 'Cafe Owner',
      email: 'owner@backyardbrew.com',
      password: hashedPassword,
      role: 'OWNER',
    },
  });

  // Create an admin user too!
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@backyardbrew.com' },
    update: {},
    create: {
      name: 'Cafe Admin',
      email: 'admin@backyardbrew.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  // Create Backyard Brew Cafe
  const cafe = await prisma.cafe.upsert({
    where: { slug: 'backyard-brew' },
    update: {},
    create: {
      name: 'Backyard Brew Cafe',
      slug: 'backyard-brew',
      description: 'A warm public website foundation for CafeOS clients.',
      address: '123 Coffee Lane, Delhi, India',
      phone: '+91 98765 43210',
      email: 'hello@backyardbrew.com',
      ownerId: ownerUser.id,
    },
  });

  // Add initial reservations (link to our new cafe
  await prisma.reservation.createMany({
    data: [
      {
        guestName: 'Aarav Mehta',
        phone: '+91 98765 43211',
        partySize: 3,
        timeSlot: '10:00 AM',
        status: 'CONFIRMED',
        source: 'Website',
        cafeId: cafe.id,
      },
      {
        guestName: 'Nisha Rao',
        phone: '+91 98765 43212',
        partySize: 2,
        timeSlot: '11:30 AM',
        status: 'PENDING',
        source: 'WhatsApp',
        cafeId: cafe.id,
      },
      {
        guestName: 'Kabir Singh',
        phone: '+91 98765 43213',
        partySize: 5,
        timeSlot: '1:00 PM',
        status: 'CONFIRMED',
        source: 'QR',
        cafeId: cafe.id,
      },
    ],
  });

  // Add initial tasks (link to our new cafe)
  await prisma.task.createMany({
    data: [
      { title: 'Confirm pending WhatsApp booking', cafeId: cafe.id },
      { title: 'Upload weekend event poster', cafeId: cafe.id },
      { title: 'Review low-stock dessert ingredients', cafeId: cafe.id },
      { title: 'Send loyalty coupon to regular guests', cafeId: cafe.id },
    ],
  });

  // Add menu categories
  const coffeeCategory = await prisma.menuCategory.create({
    data: {
      name: 'Coffee',
      slug: 'coffee',
      description: 'Our handcrafted coffee beverages',
      sortOrder: 1,
      cafeId: cafe.id,
    },
  });
  const foodCategory = await prisma.menuCategory.create({
    data: {
      name: 'Food',
      slug: 'food',
      description: 'Delicious eats to pair with your drink',
      sortOrder: 2,
      cafeId: cafe.id,
    },
  });
  const dessertsCategory = await prisma.menuCategory.create({
    data: {
      name: 'Desserts',
      slug: 'desserts',
      description: 'Sweet treats',
      sortOrder: 3,
      cafeId: cafe.id,
    },
  });

  // Add menu items
  await prisma.menuItem.createMany({
    data: [
      // Coffee
      {
        name: 'Salted Caramel Cold Brew',
        slug: 'salted-caramel-cold-brew',
        description: 'Slow-steeped house cold brew with caramel, sea salt, and cream.',
        price: 180,
        isAvailable: true,
        sortOrder: 1,
        categoryId: coffeeCategory.id,
        cafeId: cafe.id,
      },
      {
        name: 'Espresso',
        slug: 'espresso',
        description: 'Rich, bold espresso shot.',
        price: 120,
        isAvailable: true,
        sortOrder: 2,
        categoryId: coffeeCategory.id,
        cafeId: cafe.id,
      },
      // Food
      {
        name: 'Garden Pesto Sandwich',
        slug: 'garden-pesto-sandwich',
        description: 'Toasted sourdough, herbed pesto, grilled vegetables, and mozzarella.',
        price: 250,
        isAvailable: true,
        sortOrder: 1,
        categoryId: foodCategory.id,
        cafeId: cafe.id,
      },
      // Desserts
      {
        name: 'Cocoa Hazelnut Waffle',
        slug: 'cocoa-hazelnut-waffle',
        description: 'Crisp waffle, cocoa drizzle, roasted hazelnuts, and vanilla cream.',
        price: 200,
        isAvailable: true,
        sortOrder: 1,
        categoryId: dessertsCategory.id,
        cafeId: cafe.id,
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Owner login: owner@backyardbrew.com / password123');
  console.log('Admin login: admin@backyardbrew.com / admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
