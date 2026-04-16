export function sanitizeInput(input: string): string {
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /forget everything/gi,
    /you are now/gi,
    /act as/gi,
    /jailbreak/gi,
    /system prompt/gi,
  ];

  let safe = input;
  injectionPatterns.forEach((pattern) => {
    safe = safe.replace(pattern, "");
  });

  return safe.trim().substring(0, 2000);
}

export function validateFileUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "File too large. Max 5MB allowed." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only PDF and DOCX files allowed." };
  }

  return { valid: true };
}