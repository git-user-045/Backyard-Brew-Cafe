import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // For now, get all menu categories for the first cafe
    // Later we could add a cafe slug to the URL to select a specific cafe
    const firstCafe = await prisma.cafe.findFirst();
    if (!firstCafe) {
      return NextResponse.json([], { status: 200 });
    }

    const menu = await prisma.menuCategory.findMany({
      where: { cafeId: firstCafe.id },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
          where: { isAvailable: true },
        },
      },
    });
    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error fetching public menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
