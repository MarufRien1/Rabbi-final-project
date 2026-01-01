import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id: farmerIdParam } = await params;
    const farmerId = parseInt(farmerIdParam);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          farmerId: farmerId
        }
      },
      include: {
        product: true,
        order: {
          include: {
            user: {
              select: { name: true, mobile: true, email: true }
            }
          }
        }
      },
      orderBy: {
        order: { createdAt: 'desc' }
      }
    });

    return NextResponse.json(orderItems);
  } catch (error) {
    console.error('Get farmer orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
