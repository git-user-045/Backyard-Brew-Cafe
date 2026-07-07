import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get all menu items
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.cafe?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await prisma.menuItem.findMany({
      where: { cafeId: session.user.cafe.id },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// Create a menu item
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.cafe?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const item = await prisma.menuItem.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        image: data.image || null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        sortOrder: data.sortOrder || 0,
        categoryId: data.categoryId,
        cafeId: session.user.cafe.id,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
