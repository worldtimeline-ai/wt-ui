import { NextResponse } from 'next/server';
import { getMapPeriodForYear } from '@/src/lib/mapData';

export async function GET(
  request: Request,
  { params }: { params: { year: string } }
) {
  try {
    const year = parseInt(params.year);
    const period = await getMapPeriodForYear(year);

    if (!period) {
      return NextResponse.json(
        { message: "No map data for specified year" },
        { status: 404 }
      );
    }

    return NextResponse.json(period);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch map data" },
      { status: 500 }
    );
  }
}
