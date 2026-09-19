// src/app/api/sell/plate-lookup/route.ts
import { NextResponse } from "next/server";

const PLATE_RE = /^[0-9]{2,3}[가-힣][0-9]{4}$/;

// 번호판 → 차량정보 자동 조회는 실제 데이터 소스(예: KOTSA) 연동 전까지 제공하지 않는다.
// 과거엔 번호판 해시로 임의 mock 차량을 반환했는데, 사용자의 실제 번호판과 무관한
// 차량을 prefill 하여 잘못된 매물 정보를 유발했다(조작 데이터). 정직하게 503을 반환하고
// 클라이언트는 기존 처리대로 수동 입력으로 안내한다. 실데이터 연동 시 이 자리에 구현.
export async function POST(req: Request) {
  let body: { plate?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const plate = body.plate?.trim();
  if (!plate || !PLATE_RE.test(plate)) {
    return NextResponse.json({ error: "invalid plate" }, { status: 400 });
  }
  return NextResponse.json(
    {
      error:
        "번호판 자동 조회는 현재 제공되지 않습니다. 차량 정보를 직접 입력해주세요.",
    },
    { status: 503 }
  );
}
