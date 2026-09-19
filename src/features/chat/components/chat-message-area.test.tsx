import { describe, it, expect } from "vitest";
import { mapRealtimeMessage } from "./chat-message-area";

describe("mapRealtimeMessage", () => {
  it("maps a snake_case Postgres row to a camelCase Message", () => {
    const row = {
      id: "m1",
      chat_room_id: "r1",
      sender_id: "u2",
      type: "TEXT" as const,
      content: "hi",
      image_url: null,
      is_read: false,
      review_status: "APPROVED",
      block_reason: null,
      created_at: "2026-01-01T00:00:00.000Z",
    };

    expect(mapRealtimeMessage(row)).toEqual({
      id: "m1",
      chatRoomId: "r1",
      senderId: "u2",
      type: "TEXT",
      content: "hi",
      imageUrl: null,
      isRead: false,
      reviewStatus: "APPROVED",
      blockReason: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });
});
