import { NextRequest, NextResponse } from "next/server";
import RandomOrg from "random-org";

const apiKey = process.env.RANDOM_ORG_API_KEY;

export async function POST(request: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "RANDOM_ORG_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const { count, max } = (await request.json()) as {
      count: number;
      max: number;
    };

    if (
      !count ||
      !max ||
      count < 1 ||
      max < 1 ||
      count > max ||
      count > 10000
    ) {
      return NextResponse.json(
        { error: "Invalid parameters: count and max must be positive integers, count <= max, count <= 10000" },
        { status: 400 }
      );
    }

    const random = new RandomOrg({ apiKey });

    // Generate `count` unique random integers in the range [0, max - 1]
    // replacement: false ensures no duplicates (needed for fair selection)
    const result = await random.generateIntegers({
      n: count,
      min: 0,
      max: max - 1,
      replacement: false,
    });

    return NextResponse.json({
      data: result.random.data,
      requestsLeft: result.requestsLeft,
    });
  } catch (error) {
    console.error("[Random.org API Error]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Random.org request failed",
      },
      { status: 502 }
    );
  }
}
