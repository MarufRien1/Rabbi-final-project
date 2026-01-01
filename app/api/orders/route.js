import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true, mobile: true }
        },
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items, total, address } = body;

    if (!userId || !items || items.length === 0 || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          userId: parseInt(userId),
          total: parseFloat(total),
          address,
          status: 'Pending',
        },
      });

      // 2. Process items
      for (const item of items) {
        // Check stock
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Product ${item.title} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.title}`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: item.id },
          data: { stock: product.stock - item.quantity },
        });

        // Create OrderItem
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      return order;
    });

    return NextResponse.json({ message: 'Order placed successfully', orderId: result.id });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
