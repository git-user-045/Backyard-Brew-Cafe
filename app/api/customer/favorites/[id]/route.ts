import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// Remove a favorite
export async function DELETE(
  _request: Request,
  { params }: { params: Params }
) {
  try {
    const session = await auth();
    if (!session?.user?.customer?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const favoriteId = parseInt(id);

    // Verify the favorite belongs to the current customer
    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    if (favorite.customerId !== session.user.customer.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.favorite.delete({
      where: { id: favoriteId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json(
      { error: 'Failed to delete favorite' },
      { status: 500 }
    );
  }
}
