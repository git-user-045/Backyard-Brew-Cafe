import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get all menu categories (for a cafe)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.cafe?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categories = await prisma.menuCategory.findMany({
      where: { cafeId: session.user.cafe.id },
      orderBy: { sortOrder: 'asc' },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Create a new menu category
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
    const category = await prisma.menuCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        sortOrder: data.sortOrder || 0,
        cafeId: session.user.cafe.id,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
