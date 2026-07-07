import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ id: string }>;

// Update reservation status
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const reservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: data.status },
    });
    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

// Delete reservation
export async function DELETE(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    await prisma.reservation.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
