/**
 * 사주 계산 엔진
 * 생년월일시를 기반으로 천간지지를 계산하고 사주팔자를 산출합니다.
 */

// 천간 (10개)
const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEM_CHARS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 지지 (12개)
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCH_CHARS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 오행 분류
const STEM_ELEMENTS = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
const BRANCH_ELEMENTS = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];

// 음양 분류 (0: 양, 1: 음)
const STEM_YIN_YANG = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
const BRANCH_YIN_YANG = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

interface SajuPalzza {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  timeStem: string;
  timeBranch: string;
}

interface SajuInfo extends SajuPalzza {
  dayMaster: string; // 일간 (나 자신)
  age: number;
  majorPeriodStartAge: number;
  majorPeriodStem: string;
  majorPeriodBranch: string;
}

/**
 * 음력을 양력으로 변환 (간단한 구현)
 * 실제로는 더 정교한 알고리즘이 필요하지만, 여기서는 기본 로직만 구현
 */
function lunarToSolar(year: number, month: number, day: number): { year: number; month: number; day: number } {
  // 간단한 근사값 (정확한 변환은 별도 라이브러리 필요)
  // 음력 1월 1일 ≈ 양력 1월 21일 ~ 2월 20일
  // 이 부분은 실제 구현 시 더 정교한 알고리즘 필요
  return { year, month, day };
}

/**
 * 년주 천간지지 계산
 * 60갑자 주기를 이용하여 계산
 */
function calculateYearStemBranch(year: number): { stem: string; branch: string } {
  // 1900년을 기준점으로 사용 (1900년 = 경자년)
  const baseYear = 1900;
  const baseStemIndex = 6; // 경(庚)
  const baseBranchIndex = 0; // 자(子)

  const yearDiff = year - baseYear;
  const stemIndex = (baseStemIndex + yearDiff) % 10;
  const branchIndex = (baseBranchIndex + yearDiff) % 12;

  return {
    stem: STEM_CHARS[stemIndex],
    branch: BRANCH_CHARS[branchIndex],
  };
}

/**
 * 월주 천간지지 계산
 * 년주 천간을 기반으로 월주 천간을 계산
 */
function calculateMonthStemBranch(
  year: number,
  month: number,
  yearStemIndex: number
): { stem: string; branch: string } {
  // 월지는 고정 (1월=인, 2월=묘, ... 12월=축)
  const monthBranchIndex = (month + 1) % 12; // 1월=인(寅)

  // 월간은 년간을 기반으로 계산
  // 갑기년: 정월=병인, 을기년: 정월=무인, 병신년: 정월=경인, 등등
  const monthStemOffset = (yearStemIndex % 2) * 2 + Math.floor(yearStemIndex / 5) * 10;
  const monthStemIndex = (monthStemOffset + (month - 1) * 2) % 10;

  return {
    stem: STEM_CHARS[monthStemIndex],
    branch: BRANCH_CHARS[monthBranchIndex],
  };
}

/**
 * 일주 천간지지 계산
 * 율리우스 데이(Julian Day Number)를 이용한 계산
 */
function calculateDayStemBranch(year: number, month: number, day: number): { stem: string; branch: string } {
  // 간단한 율리우스 데이 계산
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // 1900년 1월 1일(경자일)을 기준점으로 사용
  const baseJdn = 2415020; // 1900년 1월 1일의 JDN
  const dayDiff = (jdn - baseJdn) % 60;

  const stemIndex = dayDiff % 10;
  const branchIndex = dayDiff % 12;

  return {
    stem: STEM_CHARS[stemIndex],
    branch: BRANCH_CHARS[branchIndex],
  };
}

/**
 * 시주 천간지지 계산
 * 일간과 시간을 기반으로 계산
 */
function calculateTimeStemBranch(hour: number, dayStemIndex: number): { stem: string; branch: string } {
  // 시지는 고정 (0시=자, 2시=축, 4시=인, ... 22시=해)
  const timeBranchIndex = Math.floor((hour + 1) / 2) % 12;

  // 시간은 일간을 기반으로 계산
  const timeStemOffset = (dayStemIndex % 2) * 5;
  const timeStemIndex = (timeStemOffset + Math.floor(hour / 2)) % 10;

  return {
    stem: STEM_CHARS[timeStemIndex],
    branch: BRANCH_CHARS[timeBranchIndex],
  };
}

/**
 * 대운 계산
 * 월주 지지를 기반으로 대운 시작 나이 계산
 */
function calculateMajorPeriod(
  monthBranchIndex: number,
  gender: 'M' | 'F'
): { startAge: number; stem: string; branch: string } {
  // 남자: 지지의 순서대로 계산, 여자: 역순
  let startAge = 0;

  if (gender === 'M') {
    startAge = (monthBranchIndex + 1) * 10 % 120;
  } else {
    startAge = (12 - monthBranchIndex) * 10 % 120;
  }

  // 대운 천간지지는 월주 다음부터 순환
  const majorPeriodStemIndex = (monthBranchIndex + 1) % 10;
  const majorPeriodBranchIndex = (monthBranchIndex + 1) % 12;

  return {
    startAge,
    stem: STEM_CHARS[majorPeriodStemIndex],
    branch: BRANCH_CHARS[majorPeriodBranchIndex],
  };
}

/**
 * 오행 강약 계산
 * 천간지지의 오행을 분석하여 각 오행의 강도를 계산
 */
function calculateElementStrength(palzza: SajuPalzza): {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
} {
  const elements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  // 천간 분석
  const stems = [palzza.yearStem, palzza.monthStem, palzza.dayStem, palzza.timeStem];
  const stemIndices = stems.map((s) => STEM_CHARS.indexOf(s));

  stemIndices.forEach((idx) => {
    const element = STEM_ELEMENTS[idx];
    if (element === '목') elements.wood += 2;
    else if (element === '화') elements.fire += 2;
    else if (element === '토') elements.earth += 2;
    else if (element === '금') elements.metal += 2;
    else if (element === '수') elements.water += 2;
  });

  // 지지 분석
  const branches = [palzza.yearBranch, palzza.monthBranch, palzza.dayBranch, palzza.timeBranch];
  const branchIndices = branches.map((b) => BRANCH_CHARS.indexOf(b));

  branchIndices.forEach((idx) => {
    const element = BRANCH_ELEMENTS[idx];
    if (element === '목') elements.wood += 1;
    else if (element === '화') elements.fire += 1;
    else if (element === '토') elements.earth += 1;
    else if (element === '금') elements.metal += 1;
    else if (element === '수') elements.water += 1;
  });

  return elements;
}

/**
 * 십신 분석
 * 일간을 기준으로 다른 천간지지의 십신을 계산
 */
function calculateTenStems(palzza: SajuPalzza): Record<string, number> {
  const dayStemIndex = STEM_CHARS.indexOf(palzza.dayStem);
  const dayElementIndex = dayStemIndex % 5;

  const tenStems: Record<string, number> = {
    비견: 0,
    겁재: 0,
    식신: 0,
    상관: 0,
    편재: 0,
    정재: 0,
    편관: 0,
    정관: 0,
    편인: 0,
    정인: 0,
  };

  // 천간 분석
  const stems = [palzza.yearStem, palzza.monthStem, palzza.timeStem];
  stems.forEach((stem) => {
    const stemIndex = STEM_CHARS.indexOf(stem);
    const elementIndex = stemIndex % 5;
    const yinYang = STEM_YIN_YANG[stemIndex];
    const dayYinYang = STEM_YIN_YANG[dayStemIndex];

    // 십신 판정 로직 (간단한 구현)
    if (elementIndex === dayElementIndex) {
      if (yinYang === dayYinYang) tenStems.비견++;
      else tenStems.겁재++;
    }
  });

  return tenStems;
}

/**
 * 사주팔자 계산 메인 함수
 */
export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0,
  gender: 'M' | 'F' = 'M'
): SajuInfo {
  // 년주 계산
  const yearResult = calculateYearStemBranch(year);
  const yearStemIndex = STEM_CHARS.indexOf(yearResult.stem);

  // 월주 계산
  const monthResult = calculateMonthStemBranch(year, month, yearStemIndex);
  const monthBranchIndex = BRANCH_CHARS.indexOf(monthResult.branch);

  // 일주 계산
  const dayResult = calculateDayStemBranch(year, month, day);

  // 시주 계산
  const dayStemIndex = STEM_CHARS.indexOf(dayResult.stem);
  const timeResult = calculateTimeStemBranch(hour, dayStemIndex);

  // 대운 계산
  const majorPeriod = calculateMajorPeriod(monthBranchIndex, gender);

  // 현재 나이 계산
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  const palzza: SajuPalzza = {
    yearStem: yearResult.stem,
    yearBranch: yearResult.branch,
    monthStem: monthResult.stem,
    monthBranch: monthResult.branch,
    dayStem: dayResult.stem,
    dayBranch: dayResult.branch,
    timeStem: timeResult.stem,
    timeBranch: timeResult.branch,
  };

  return {
    ...palzza,
    dayMaster: dayResult.stem,
    age,
    majorPeriodStartAge: majorPeriod.startAge,
    majorPeriodStem: majorPeriod.stem,
    majorPeriodBranch: majorPeriod.branch,
  };
}

/**
 * 사주 분석 정보 계산
 */
export function analyzeSaju(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0,
  gender: 'M' | 'F' = 'M'
) {
  const saju = calculateSaju(year, month, day, hour, minute, gender);
  const elements = calculateElementStrength(saju);
  const tenStems = calculateTenStems(saju);

  return {
    saju,
    elements,
    tenStems,
  };
}

/**
 * 오행 균형 점수 계산 (0-100)
 */
export function calculateElementBalance(elements: {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}): number {
  const values = Object.values(elements);
  const avg = values.reduce((a, b) => a + b, 0) / 5;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / 5;
  const stdDev = Math.sqrt(variance);

  // 표준편차가 작을수록 균형이 좋음
  const balance = Math.max(0, 100 - stdDev * 10);
  return Math.round(balance);
}

/**
 * 궁합 점수 계산 (0-100)
 */
export function calculateCompatibility(
  firstSaju: SajuInfo,
  secondSaju: SajuInfo,
  firstGender: 'M' | 'F',
  secondGender: 'M' | 'F'
): number {
  let score = 50; // 기본 점수

  // 일간 오행 상성 분석
  const firstDayStemIndex = STEM_CHARS.indexOf(firstSaju.dayStem);
  const secondDayStemIndex = STEM_CHARS.indexOf(secondSaju.dayStem);

  const firstElement = STEM_ELEMENTS[firstDayStemIndex];
  const secondElement = STEM_ELEMENTS[secondDayStemIndex];

  // 상생 관계 (+10점)
  if (
    (firstElement === '목' && secondElement === '화') ||
    (firstElement === '화' && secondElement === '토') ||
    (firstElement === '토' && secondElement === '금') ||
    (firstElement === '금' && secondElement === '수') ||
    (firstElement === '수' && secondElement === '목')
  ) {
    score += 10;
  }

  // 상극 관계 (-10점)
  if (
    (firstElement === '목' && secondElement === '토') ||
    (firstElement === '토' && secondElement === '수') ||
    (firstElement === '수' && secondElement === '화') ||
    (firstElement === '화' && secondElement === '금') ||
    (firstElement === '금' && secondElement === '목')
  ) {
    score -= 10;
  }

  // 성별 조화도 분석
  if ((firstGender === 'M' && secondGender === 'F') || (firstGender === 'F' && secondGender === 'M')) {
    score += 5;
  }

  // 나이 차이 분석 (너무 크면 감점)
  const ageDiff = Math.abs(firstSaju.age - secondSaju.age);
  if (ageDiff > 20) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}
