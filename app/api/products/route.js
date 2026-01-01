import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const farmerId = searchParams.get('farmerId');

    let where = {};
    if (category) {
      where.category = { equals: category, mode: 'insensitive' }; // Case insensitive
    }
    if (farmerId) {
      where.farmerId = parseInt(farmerId);
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, price, details, nature, img, farmerId, stock } = body;

    if (!title || !category || !price || !farmerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        category,
        price: parseFloat(price),
        details,
        nature,
        img,
        stock: parseInt(stock) || 1,
        farmerId: parseInt(farmerId),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
