# 종목추천 앱

[stock-pick](https://github.com/ysjang1972/stock-pick)(비공개)의 일일 추천을 휴대폰에서 보고 주문을 승인하는 웹앱(PWA)입니다.

- 이 저장소에는 화면 코드만 있습니다. 추천·계좌 데이터와 증권사 키는 없습니다.
- 앱은 사용자가 넣은 GitHub 토큰(stock-pick 저장소 전용, Contents 읽기 + Actions 읽기·쓰기)으로
  결과 파일을 읽고 `order.yml`(주문 승인), `sync.yml`(계좌 동기화) 등을 실행합니다. 토큰은 그 휴대폰에만 저장됩니다.
- 설치: 안드로이드 Chrome 으로 GitHub Pages 주소를 열고 메뉴 → 앱 설치(홈 화면에 추가).
