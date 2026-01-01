import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [totalOrders, totalFarmers, totalCustomers, products] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'farmer' } }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.product.count(),
    ]);

    const orders = await prisma.order.findMany({ select: { total: true } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({
      totalOrders,
      totalFarmers,
      totalCustomers,
      totalProducts: products,
      totalRevenue
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
