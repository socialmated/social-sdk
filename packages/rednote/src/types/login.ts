interface CreateLoginQRCodeRequest {
  qr_type: number; // enum
}

interface QRCode {
  qr_id: string;
  code: string;
  url: string;
  multi_flag: number; // enum
}

interface QRCodeStatus {
  code_status: number; // enum
}

export type { CreateLoginQRCodeRequest, QRCode, QRCodeStatus };
