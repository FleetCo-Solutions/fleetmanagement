import { NextRequest } from 'next/server';
import { loginDriver } from './post';

export async function POST(request: NextRequest) {
  return loginDriver(request);
}

