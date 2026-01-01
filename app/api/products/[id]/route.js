import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { farmer: { select: { name: true, mobile: true } } }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
