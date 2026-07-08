import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get all reservations
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.cafe?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: { cafeId: session.user.cafe.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

// Create new reservation
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    // Get the first cafe for now (later we could use cafe slug)
    const firstCafe = await prisma.cafe.findFirst();
    if (!firstCafe) {
      return NextResponse.json(
        { error: 'No cafe found' },
        { status: 500 }
      );
    }

    const data = await request.json();
    
    // If user is logged in as customer, link reservation to their customer account
    const customerId = session?.user?.role === 'CUSTOMER' && session?.user?.customer?.id 
      ? session.user.customer.id 
      : null;

    const reservation = await prisma.reservation.create({
      data: {
        guestName: data.guestName,
        phone: data.phone,
        partySize: data.partySize,
        timeSlot: data.timeSlot,
        notes: data.notes || null,
        cafeId: firstCafe.id,
        customerId: customerId,
      },
    });
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
