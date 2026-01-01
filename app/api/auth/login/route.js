import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, mobile, password, role } = body;

    if (!password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let user;
    if (role === 'customer') {
      if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      user = await prisma.user.findUnique({ where: { email } });
    } else if (role === 'farmer') {
      if (!mobile) return NextResponse.json({ error: 'Mobile is required' }, { status: 400 });
      user = await prisma.user.findUnique({ where: { mobile } });
    }

    if (!user || user.password !== password) { // In production, compare hashed passwords
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user info (excluding password ideally, but keeping simple for now)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ message: 'Login successful', user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
