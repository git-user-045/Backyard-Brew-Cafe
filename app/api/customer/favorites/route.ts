import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get all favorites for current customer
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.customer?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { customerId: session.user.customer.id },
      include: {
        menuItem: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// Add a favorite
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.customer?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { menuItemId } = data;

    if (!menuItemId) {
      return NextResponse.json(
        { error: 'MenuItem ID is required' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        customerId_menuItemId: {
          customerId: session.user.customer.id,
          menuItemId: menuItemId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Item already favorited' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        customerId: session.user.customer.id,
        menuItemId: menuItemId,
      },
      include: {
        menuItem: {
          include: {
            category: true,
          },
        },
      },
    });
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('Error creating favorite:', error);
    return NextResponse.json(
      { error: 'Failed to create favorite' },
      { status: 500 }
    );
  }
}
