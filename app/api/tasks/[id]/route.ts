import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ id: string }>;

// Update task completion
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { completed: data.completed },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// Delete task
export async function DELETE(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
