import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveWeather } from '@/lib/weather/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const name = searchParams.get('name') || 'आपका क्षेत्र';

    // Default to central India (e.g. Bhopal/Indore 23.25, 77.41) if not provided
    const lat = latStr ? parseFloat(latStr) : 23.2599;
    const lon = lonStr ? parseFloat(lonStr) : 77.4126;

    const weatherData = await fetchLiveWeather(lat, lon, name);

    return NextResponse.json({
      success: true,
      data: weatherData,
    });
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Weather API route error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'मौसम की जानकारी प्राप्त नहीं हो सकी।',
      },
      { status: 500 }
    );
  }
}
