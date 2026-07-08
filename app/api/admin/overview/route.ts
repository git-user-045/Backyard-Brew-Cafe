import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cafes = await prisma.cafe.findMany({
      include: {
        owner: {
          select: { name: true, email: true },
        },
        reservations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { menuItems: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        cafe: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingReservations = await prisma.reservation.findMany({
      where: { status: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        cafe: {
          select: { name: true },
        },
      },
    });

    const totalReservations = await prisma.reservation.count();
    const confirmedReservations = await prisma.reservation.count({ where: { status: 'CONFIRMED' } });
    const cancelledReservations = await prisma.reservation.count({ where: { status: 'CANCELLED' } });
    const openTasks = await prisma.task.count({ where: { completed: false } });
    const recentReservations = await prisma.reservation.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { cafe: { select: { name: true } } },
    });

    const summary = {
      activeClients: cafes.length,
      monthlyRevenue: `Rs. ${((totalReservations * 450) + (cafes.length * 1200)).toLocaleString()}`,
      openIssues: pendingReservations.length,
      churnRisk: openTasks > 3 ? 2 : 1,
    };

    const clients = cafes.map((cafe) => ({
      cafe: cafe.name,
      owner: cafe.owner?.name || 'Unassigned',
      city: cafe.address?.split(',').pop()?.trim() || 'N/A',
      plan: cafe._count.menuItems > 5 ? 'Advanced' : cafe._count.menuItems > 2 ? 'Pro' : 'Starter',
      status: 'Active',
      mrr: `Rs. ${(250 + cafe._count.menuItems * 120).toLocaleString()}`,
      lastActive: cafe.reservations[0]?.createdAt ? 'Recently active' : 'No activity yet',
    }));

    const supportQueue = pendingReservations.map((reservation) => ({
      client: reservation.cafe?.name || 'Unknown cafe',
      issue: `${reservation.guestName} requested ${reservation.partySize} guest${reservation.partySize > 1 ? 's' : ''} for ${reservation.timeSlot}`,
      priority: reservation.partySize >= 4 ? 'High' : 'Medium',
    }));

    const onboarding = cafes.map((cafe) => ({
      client: cafe.name,
      progress: cafe._count.menuItems > 0 ? 85 : 45,
      nextStep: cafe._count.menuItems > 0 ? 'Monitor daily operations' : 'Add menu items',
      stage: cafe._count.menuItems > 0 ? 'Live' : 'Setup',
    }));

    const planMix = [
      { plan: 'Starter', count: clients.filter((client) => client.plan === 'Starter').length },
      { plan: 'Pro', count: clients.filter((client) => client.plan === 'Pro').length },
      { plan: 'Advanced', count: clients.filter((client) => client.plan === 'Advanced').length },
    ];

    const subscriptions = cafes.map((cafe) => ({
      cafe: cafe.name,
      plan: cafe._count.menuItems > 5 ? 'Advanced' : cafe._count.menuItems > 2 ? 'Pro' : 'Starter',
      revenue: `Rs. ${(250 + cafe._count.menuItems * 120).toLocaleString()}`,
      status: cafe.reservations.length > 0 ? 'Active' : 'Trial',
      nextBilling: 'Next billing in 3 days',
    }));

    const health = cafes.map((cafe) => {
      const score = Math.min(99, 70 + (cafe._count.menuItems * 4) + (cafe.reservations.length > 0 ? 8 : 0));
      const status = score >= 85 ? 'Healthy' : score >= 70 ? 'Watch' : 'Needs attention';
      return {
        cafe: cafe.name,
        score,
        status,
        issue: cafe._count.menuItems === 0 ? 'Menu setup pending' : cafe.reservations.length === 0 ? 'No recent reservations' : 'Operationally stable',
      };
    });

    const access = users.map((user) => ({
      name: user.name || user.email || 'Unnamed user',
      email: user.email || 'No email',
      role: user.role,
      cafe: user.cafe?.name || 'Platform',
      status: user.role === 'ADMIN' ? 'Full access' : 'Limited access',
    }));

    return NextResponse.json({
      summary,
      clients,
      supportQueue,
      onboarding,
      planMix,
      subscriptions,
      health,
      access,
      stats: {
        totalReservations,
        confirmedReservations,
        cancelledReservations,
        openTasks,
        recentReservations,
      },
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return NextResponse.json({ error: 'Failed to fetch admin overview' }, { status: 500 });
  }
}
