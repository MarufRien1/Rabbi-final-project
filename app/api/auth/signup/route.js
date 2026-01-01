import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, mobile, password, role } = body;

    if (!name || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    let existingUser;
    if (role === 'customer') {
      if (!email) return NextResponse.json({ error: 'Email is required for customers' }, { status: 400 });
      existingUser = await prisma.user.findUnique({ where: { email } });
    } else if (role === 'farmer') {
      if (!mobile) return NextResponse.json({ error: 'Mobile is required for farmers' }, { status: 400 });
      existingUser = await prisma.user.findUnique({ where: { mobile } });
    }

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: role === 'customer' ? email : null,
        mobile: role === 'farmer' ? mobile : null,
        password, // In production, hash this password!
        role,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
