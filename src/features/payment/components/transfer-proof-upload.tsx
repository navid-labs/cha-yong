"use client";

import { useRef, useState } from "react";
import { FileCheck2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

// Mirror of storage.ts ALLOWED_TYPES / MAX_SIZE (client-safe; server is source of truth).
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;
const MAX_SIZE = 20 * 1024 * 1024;

export function validateProofFile(
  file: File
): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return { ok: false, error: "JPEG, PNG, WebP, PDF 파일만 업로드할 수 있습니다." };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false, error: "파일 크기는 20MB 이하여야 합니다." };
  }
  return { ok: true };
}

type TransferProofUploadProps = {
  escrowId: string;
  initialProofKey: string | null;
  initialSignedUrl: string | null;
};

export function TransferProofUpload({
  escrowId,
  initialProofKey,
  initialSignedUrl,
}: TransferProofUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [proofKey, setProofKey] = useState<string | null>(initialProofKey);
  const [signedUrl, setSignedUrl] = useState<string | null>(initialSignedUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    const valid = validateProofFile(file);
    if (!valid.ok) {
      setError(valid.error);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/escrow/${escrowId}/transfer-proof`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          typeof body.error === "string" ? body.error : "업로드에 실패했습니다."
        );
      }

      const data = await res.json();
      setProofKey(typeof data.key === "string" ? data.key : null);
      setSignedUrl(typeof data.signedUrl === "string" ? data.signedUrl : null);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "업로드에 실패했습니다."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {proofKey ? (
        <div className="flex items-center justify-between rounded-lg border border-[var(--chayong-divider)] px-3 py-2">
          <span className="flex items-center gap-2 text-sm text-[var(--chayong-text)]">
            <FileCheck2 size={16} style={{ color: "var(--chayong-success)" }} />
            증빙이 업로드되었습니다
          </span>
          {signedUrl && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => window.open(signedUrl, "_blank")}
            >
              미리보기
            </Button>
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--chayong-text-sub)]">
          명의변경 완료 후 등록증·인수증 등 증빙을 업로드해 주세요. (JPEG, PNG, WebP, PDF)
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <Button
        type="button"
        variant={proofKey ? "outline" : "default"}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="gap-2"
      >
        <Upload size={16} />
        {uploading ? "업로드 중..." : proofKey ? "다시 업로드" : "증빙 업로드"}
      </Button>

      {error && (
        <div className="rounded-lg bg-[#FEF2F2] px-3 py-2 text-sm text-[var(--chayong-danger)]">
          {error}
        </div>
      )}
    </div>
  );
}
