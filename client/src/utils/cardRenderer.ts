/**
 * 사주 분석 결과를 캔버스를 이용해 이미지로 렌더링하는 유틸리티
 */

export interface SajuCardData {
  name?: string;
  birthDate: string;
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  timeStem: string;
  timeBranch: string;
  dayMaster: string;
  woodStrength: number;
  fireStrength: number;
  earthStrength: number;
  metalStrength: number;
  waterStrength: number;
}

export interface CompatibilityCardData {
  firstName: string;
  firstSaju: string;
  secondName: string;
  secondSaju: string;
  compatibilityScore: number;
  compatibility: string;
}

/**
 * 사주 분석 카드 이미지 생성
 */
export async function renderSajuCard(data: SajuCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  // 배경 그라데이션
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#FFFFFF");
  gradient.addColorStop(1, "#F5F1E8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 황토색 상단 바
  ctx.fillStyle = "#D4A853";
  ctx.fillRect(0, 0, canvas.width, 120);

  // 제목
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 48px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText("Premium Saju", canvas.width / 2, 70);

  // 이름 또는 기본 텍스트
  ctx.fillStyle = "#333333";
  ctx.font = "32px 'Noto Serif KR'";
  ctx.fillText(data.name || "Your Saju Analysis", canvas.width / 2, 180);

  // 생년월일
  ctx.fillStyle = "#666666";
  ctx.font = "24px 'Noto Sans KR'";
  ctx.fillText(data.birthDate, canvas.width / 2, 230);

  // 사주팔자 섹션
  ctx.fillStyle = "#D4A853";
  ctx.fillRect(60, 280, canvas.width - 120, 3);

  ctx.fillStyle = "#333333";
  ctx.font = "bold 28px 'Noto Serif KR'";
  ctx.textAlign = "left";
  ctx.fillText("Four Pillars of Destiny", 80, 340);

  // 사주팔자 표시
  const pillars = [
    { label: "Year (年)", stem: data.yearStem, branch: data.yearBranch, x: 100 },
    { label: "Month (月)", stem: data.monthStem, branch: data.monthBranch, x: 320 },
    { label: "Day (日)", stem: data.dayStem, branch: data.dayBranch, x: 540 },
    { label: "Hour (時)", stem: data.timeStem, branch: data.timeBranch, x: 760 },
  ];

  pillars.forEach((pillar) => {
    // 배경 박스
    ctx.fillStyle = "#F0E6D2";
    ctx.fillRect(pillar.x, 370, 180, 100);
    ctx.strokeStyle = "#C8A96E";
    ctx.lineWidth = 2;
    ctx.strokeRect(pillar.x, 370, 180, 100);

    // 라벨
    ctx.fillStyle = "#666666";
    ctx.font = "16px 'Noto Sans KR'";
    ctx.textAlign = "center";
    ctx.fillText(pillar.label, pillar.x + 90, 395);

    // 천간지지
    ctx.fillStyle = "#333333";
    ctx.font = "bold 32px 'Noto Serif KR'";
    ctx.fillText(pillar.stem + pillar.branch, pillar.x + 90, 450);
  });

  // 일주 정보
  ctx.fillStyle = "#D4A853";
  ctx.fillRect(60, 510, canvas.width - 120, 3);

  ctx.fillStyle = "#333333";
  ctx.font = "bold 28px 'Noto Serif KR'";
  ctx.textAlign = "left";
  ctx.fillText("Day Master", 80, 570);

  ctx.fillStyle = "#666666";
  ctx.font = "24px 'Noto Serif KR'";
  ctx.fillText(data.dayMaster, 80, 620);

  // 오행 강약 섹션
  ctx.fillStyle = "#D4A853";
  ctx.fillRect(60, 670, canvas.width - 120, 3);

  ctx.fillStyle = "#333333";
  ctx.font = "bold 28px 'Noto Serif KR'";
  ctx.textAlign = "left";
  ctx.fillText("Element Balance", 80, 730);

  // 오행 바 차트
  const elements = [
    { name: "木", strength: data.woodStrength, color: "#4CAF50", x: 100 },
    { name: "火", strength: data.fireStrength, color: "#FF6B6B", x: 280 },
    { name: "土", strength: data.earthStrength, color: "#FFC107", x: 460 },
    { name: "金", strength: data.metalStrength, color: "#9E9E9E", x: 640 },
    { name: "水", strength: data.waterStrength, color: "#2196F3", x: 820 },
  ];

  elements.forEach((elem) => {
    // 라벨
    ctx.fillStyle = "#333333";
    ctx.font = "bold 20px 'Noto Serif KR'";
    ctx.textAlign = "center";
    ctx.fillText(elem.name, elem.x + 60, 790);

    // 배경 바
    ctx.fillStyle = "#E0E0E0";
    ctx.fillRect(elem.x, 810, 120, 30);

    // 강약 바
    ctx.fillStyle = elem.color;
    const barWidth = (elem.strength / 100) * 120;
    ctx.fillRect(elem.x, 810, barWidth, 30);

    // 수치
    ctx.fillStyle = "#333333";
    ctx.font = "bold 18px 'Noto Sans KR'";
    ctx.textAlign = "center";
    ctx.fillText(`${elem.strength}`, elem.x + 60, 835);
  });

  // 하단 로고
  ctx.fillStyle = "#C8A96E";
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "20px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText("Discover Your True Destiny - Premium Saju", canvas.width / 2, canvas.height - 20);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });
}

/**
 * 호환성 분석 카드 이미지 생성
 */
export async function renderCompatibilityCard(data: CompatibilityCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  // 배경 그라데이션
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#FFFFFF");
  gradient.addColorStop(1, "#F5F1E8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 황토색 상단 바
  ctx.fillStyle = "#D4A853";
  ctx.fillRect(0, 0, canvas.width, 120);

  // 제목
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 48px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText("Saju Compatibility", canvas.width / 2, 70);

  // 두 사람의 이름
  ctx.fillStyle = "#333333";
  ctx.font = "bold 36px 'Noto Serif KR'";
  ctx.fillText(data.firstName, 150, 220);

  ctx.fillStyle = "#D4A853";
  ctx.font = "32px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText("&", canvas.width / 2, 220);

  ctx.fillStyle = "#333333";
  ctx.font = "bold 36px 'Noto Serif KR'";
  ctx.textAlign = "right";
  ctx.fillText(data.secondName, canvas.width - 150, 220);

  // 사주 정보
  ctx.fillStyle = "#666666";
  ctx.font = "20px 'Noto Sans KR'";
  ctx.textAlign = "left";
  ctx.fillText(data.firstSaju, 100, 300);

  ctx.textAlign = "right";
  ctx.fillText(data.secondSaju, canvas.width - 100, 300);

  // 호환성 점수 섹션
  ctx.fillStyle = "#D4A853";
  ctx.fillRect(60, 380, canvas.width - 120, 3);

  ctx.fillStyle = "#333333";
  ctx.font = "bold 28px 'Noto Serif KR'";
  ctx.textAlign = "left";
  ctx.fillText("Compatibility Score", 80, 440);

  // 큰 점수 표시
  const scoreColor =
    data.compatibilityScore >= 80
      ? "#4CAF50"
      : data.compatibilityScore >= 60
        ? "#FFC107"
        : "#FF6B6B";

  ctx.fillStyle = scoreColor;
  ctx.font = "bold 120px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText(`${data.compatibilityScore}%`, canvas.width / 2, 600);

  // 호환성 설명
  ctx.fillStyle = "#666666";
  ctx.font = "24px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText(data.compatibility, canvas.width / 2, 680);

  // 호환성 바
  ctx.fillStyle = "#E0E0E0";
  ctx.fillRect(150, 730, canvas.width - 300, 40);

  ctx.fillStyle = scoreColor;
  const barWidth = ((data.compatibilityScore / 100) * (canvas.width - 300)) | 0;
  ctx.fillRect(150, 730, barWidth, 40);

  // 해석
  const interpretations: { [key: string]: string } = {
    excellent: "Excellent Compatibility - A harmonious match",
    good: "Good Compatibility - Compatible relationship",
    moderate: "Moderate Compatibility - Some challenges",
    challenging: "Challenging Compatibility - Requires effort",
  };

  let interpretation = interpretations.moderate;
  if (data.compatibilityScore >= 80) interpretation = interpretations.excellent;
  else if (data.compatibilityScore >= 60) interpretation = interpretations.good;
  else if (data.compatibilityScore < 40) interpretation = interpretations.challenging;

  ctx.fillStyle = "#333333";
  ctx.font = "22px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText(interpretation, canvas.width / 2, 850);

  // 하단 로고
  ctx.fillStyle = "#C8A96E";
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "20px 'Noto Serif KR'";
  ctx.textAlign = "center";
  ctx.fillText("Check Your Compatibility - Premium Saju", canvas.width / 2, canvas.height - 20);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });
}

/**
 * 이미지 다운로드
 */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 카카오톡 공유 준비
 */
export async function prepareKakaoShare(imageBlob: Blob, title: string, description: string): Promise<string> {
  // 이미지를 Base64로 변환
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.readAsDataURL(imageBlob);
  });
}
