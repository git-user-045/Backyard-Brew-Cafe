import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ id: string }>;

// Update a menu item
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const item = await prisma.menuItem.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// Delete a menu item
export async function DELETE(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    await prisma.menuItem.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
