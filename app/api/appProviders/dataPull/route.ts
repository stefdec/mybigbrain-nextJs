import { NextResponse } from 'next/server';
import connection from '@config/db';

export async function POST(req: Request) {
    const { providerId, providerName } = await req.json();
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 200 })
}