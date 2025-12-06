# 롯데월드 모바일 앱 (LotteWorld App)

본 프로젝트는 롯데월드 방문객을 위한 **티켓·예매·결제·알림·지도/POI·공연·운휴 안내** 등 <br>
이용 전반의 기능을 하나의 서비스로 통합 제공하는 **React Native 기반 모바일 앱**입니다.

사용자는 실시간 공연 알림, 지도 기반 탐색, 티켓 관리 등<br>
방문 흐름에 맞춘 기능을 통해 롯데월드 이용 경험을 향상시킬 수 있습니다.

---

## 프로젝트 구조 / 관련 링크
	• Admin Web: https://media.seowon.ac.kr/s202011341/lotteworldadmin
	• Backend API: Railway 기반 Node.js REST API
	• Frontend (App): React Native (Expo)

---

## 주요 기능

### 0. 사용자 로그인
- 이메일 인증코드를 통한 회원가입
- 이메일·비밀번호 기반 로그인
- JWT 토큰 기반 사용자 인증 및 자동 로그인 유지
- 카카오 로그인 적용 가능 구조
  
### 1. 홈 메인 화면
- 오늘의 공연, 운영 정보, 혼잡도 등 요약 정보 제공  
- MY 티켓 여부에 따른 개인화된 메인 UI 구성  
- 최근 알림, 즐겨찾기 공연 등을 한눈에 확인 가능

### 2. 티켓 관리
- 사용자의 예매 티켓 목록 조회  
- 티켓 상세 정보(방문일, 옵션, 수량 등) 제공  
- 보유 티켓에 따라 이용 가능 기능 자동 활성화

### 3. 티켓 예매
- 방문일·인원·옵션 선택 후 티켓 예매 진행  
- 예매 정보 서버 저장  
- 결제 전후 단계 오류 처리 및 예외 대응

### 4. 결제(I’mport 연동)
- 아임포트(I’mport) WebView 결제 연동  
- 결제 성공 시 서버에 주문 정보 자동 저장  
- 결제 실패·취소 처리  
- 결제 완료 후 TicketComplete 화면 이동

### 5. 알림 기능 (FCM 연동)
- 공연 시작 전 리마인드 알림  
- 운휴·재가동 알림 실시간 수신  
- 공지/서비스 안내 알림 제공  
- 앱 알림함 + 디바이스 푸시 동시에 제공

### 6. 지도 / POI / 경로 제공
- 어트랙션, 공연장, 음식점 등 POI 정보 표시  
- 운영 시간·위치·설명 등 상세 정보 제공  
- 카테고리 기반 필터링  
- 지도를 활용한 탐색 중심 UX 제공

### 7. 운휴 정보 제공
- 어트랙션·공연 등의 운휴 상태 표시  
- 운휴 사유 및 재개 예정 정보 제공
  
### 8. 공지사항 및 FAQ
- 서비스 공지사항 목록 제공  
- 공지 상세 정보 조회  
- 자주 묻는 질문(FAQ) 제공

### 9. 앱 설정
- 사용자 정보 조회·수정  
- 알림 설정 관리  
- 로그아웃 및 계정 관련 기능 제공

---

## 기술 스택

### Frontend
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** Expo Router / React Navigation
- **Network:** Axios
- **Storage:** AsyncStorage
- **Payment:** I’mport WebView Integration

### Backend / Infra (연동)
- **API 서버:** Node.js + Express 기반 REST API  
- **Database:** MariaDB  
  - 사용자, 티켓, 주문, 알림 등 핵심 데이터 관리  
- **Email Verification:** Nodemailer 기반 이메일 인증코드 발송/검증  
- **Push Notification:** Firebase Cloud Messaging(FCM)

---

## 배포 방식 
- Expo EAS Build(Android)  
- Production/Development 환경 분리(.env)  
- OTA 업데이트(Expo Updates) 적용 가능한 구조  

---
