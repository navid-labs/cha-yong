import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VehicleHistory } from "./vehicle-history";

describe("VehicleHistory", () => {
  it("renders real owner/accident data", () => {
    render(<VehicleHistory ownerCount={1} accidentCount={0} />);
    expect(screen.getByText("무사고")).toBeInTheDocument();
    expect(screen.getByText("0회")).toBeInTheDocument();
  });

  it("does not claim unverified flood/theft/total-loss as fact", () => {
    render(<VehicleHistory ownerCount={1} accidentCount={0} />);
    // 데이터 소스가 없는 항목을 '없음'/'확인 완료'(검증된 사실처럼)로 주장하지 않는다.
    expect(screen.queryAllByText("없음")).toHaveLength(0);
    expect(screen.queryAllByText("확인 완료")).toHaveLength(0);
    // 침수/도난/전손/용도변경은 '미조회'(중립)로 표기.
    expect(screen.getAllByText("미조회").length).toBeGreaterThanOrEqual(4);
  });

  it("shows a disclaimer that official history lookup is not connected", () => {
    render(<VehicleHistory ownerCount={1} accidentCount={0} />);
    expect(screen.getByText(/미확인 상태입니다/)).toBeInTheDocument();
  });
});
