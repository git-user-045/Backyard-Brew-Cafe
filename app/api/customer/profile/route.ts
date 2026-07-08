import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get customer profile
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.customer?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.user.customer.id },
    });
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// Update customer profile
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.customer?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, phone } = data;

    const customer = await prisma.customer.update({
      where: { id: session.user.customer.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
      },
    });

    // Also update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
