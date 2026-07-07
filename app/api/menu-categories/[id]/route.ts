import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ id: string }>;

// Update a category
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const category = await prisma.menuCategory.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    await prisma.menuCategory.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
