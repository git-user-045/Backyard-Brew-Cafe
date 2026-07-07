import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all reservations
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
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
    const data = await request.json();
    const reservation = await prisma.reservation.create({
      data: {
        guestName: data.guestName,
        phone: data.phone,
        partySize: data.partySize,
        timeSlot: data.timeSlot,
        notes: data.notes || null,
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
