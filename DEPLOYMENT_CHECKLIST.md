# 명품 사주 분석 - 배포 체크리스트

## 환경 변수 검증

### 필수 환경 변수
- [x] `DATABASE_URL` - MySQL/TiDB 연결 문자열
- [x] `JWT_SECRET` - 세션 쿠키 서명 시크릿
- [x] `VITE_APP_ID` - Manus OAuth 애플리케이션 ID
- [x] `OAUTH_SERVER_URL` - Manus OAuth 백엔드 URL
- [x] `VITE_OAUTH_PORTAL_URL` - Manus 로그인 포털 URL
- [x] `OWNER_OPEN_ID` - 소유자 OpenID
- [x] `OWNER_NAME` - 소유자 이름
- [x] `BUILT_IN_FORGE_API_URL` - Manus 내장 API URL
- [x] `BUILT_IN_FORGE_API_KEY` - Manus 내장 API 키
- [x] `VITE_FRONTEND_FORGE_API_KEY` - 프론트엔드 Forge API 키
- [x] `VITE_FRONTEND_FORGE_API_URL` - 프론트엔드 Forge API URL
- [x] `VITE_KAKAO_APP_ID` - 카카오 앱 ID (1451232)

### 선택 환경 변수
- [ ] `VITE_APP_TITLE` - 웹사이트 제목 (선택)
- [ ] `VITE_APP_LOGO` - 웹사이트 로고 (선택)

## 빌드 및 테스트

### 빌드 검증
- [x] `pnpm build` 성공 (경고 제외)
- [x] 빌드 산출물 생성 (dist/index.js 71.9kb)
- [x] TypeScript 컴파일 오류 없음
- [x] ESBuild 번들링 성공

### 테스트 검증
- [x] 모든 단위 테스트 통과 (14/14)
  - [x] sajuCalculator.test.ts (13 tests)
  - [x] auth.logout.test.ts (1 test)
- [x] dev 서버 정상 작동
- [x] localhost:3000 응답 정상

## 기능 검증

### 사주 분석 기능
- [x] 생년월일시 입력 기반 사주팔자 계산
- [x] 천간지지, 오행, 십신 분석
- [x] 대운, 세운, 월운 계산
- [x] 분석 결과 저장 기능
- [x] 분석 결과 조회 기능

### 궁합 분석 기능
- [x] 두 사주 비교 분석
- [x] 호환성 점수 계산
- [x] 궁합 해설 제공

### AI 상담 기능
- [x] LLM 기반 명리학 전문가 상담
- [x] 실시간 메시지 송수신
- [x] 성격, 건강, 재물운, 직업운, 연애운, 가족운 분석

### SNS 공유 기능
- [x] 이미지 카드 자동 생성
- [x] 이미지 다운로드 기능
- [x] 카카오톡 공유 SDK 통합
- [x] 카카오톡 공유 버튼 기능

### 사용자 관리 기능
- [x] Manus OAuth 로그인/회원가입
- [x] 사주 분석 결과 저장
- [x] 히스토리 조회 및 관리
- [x] 기록 삭제 기능
- [x] 프로필 조회 및 수정
- [x] 로그아웃 기능

## UI/UX 검증

### 디자인 및 스타일
- [x] 화이트 베이스 + 황토색(#D4A853, #C8A96E) 테마
- [x] Noto Serif KR 폰트 적용
- [x] 반응형 레이아웃 (모바일/태블릿/데스크톱)
- [x] 태극 로딩 애니메이션

### 페이지 및 라우트
- [x] 홈 페이지 (/)
- [x] 사주 분석 페이지 (/analysis)
- [x] 궁합 분석 페이지 (/compatibility)
- [x] 나이별 운세 페이지 (/yearly-fortune)
- [x] AI 상담 페이지 (/consultation)
- [x] 히스토리 페이지 (/history)
- [x] 프로필 페이지 (/profile)

### 한국어 완전 변환
- [x] 모든 UI 텍스트 한국어화
- [x] 네비게이션 메뉴 한국어화
- [x] AI 프롬프트 한국어화
- [x] 에러 메시지 한국어화

## 배포 전 최종 점검

### 보안 검증
- [x] 환경 변수 노출 없음
- [x] 민감한 정보 클라이언트 노출 없음
- [x] OAuth 토큰 안전하게 처리
- [x] 데이터베이스 연결 보안

### 성능 검증
- [x] 빌드 크기 최적화 (71.9kb)
- [x] 번들 청크 크기 관리
- [x] 로딩 애니메이션 부드러움
- [x] 응답 시간 적절함

### 호환성 검증
- [x] 최신 브라우저 호환성
- [x] 모바일 반응형 테스트
- [x] 크로스 브라우저 테스트 (필요 시)

## 배포 절차

1. **Manus Management UI에서 Publish 버튼 클릭**
   - 자동 배포 시작
   - 프로덕션 환경 변수 자동 적용

2. **배포 후 검증**
   - 프로덕션 URL 접속 확인
   - 주요 기능 동작 확인
   - 에러 로그 모니터링

3. **모니터링**
   - 사용자 피드백 수집
   - 에러 로그 확인
   - 성능 메트릭 모니터링

## 완료 상태

✅ **배포 준비 완료**

모든 필수 항목이 완료되었으며, 프로덕션 배포 가능 상태입니다.

**마지막 업데이트:** 2026-05-08
**빌드 버전:** 1093887b
**테스트 상태:** 14/14 통과
