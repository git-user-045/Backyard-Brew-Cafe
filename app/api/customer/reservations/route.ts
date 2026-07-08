import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.customer?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: { customerId: session.user.customer.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching customer reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}
