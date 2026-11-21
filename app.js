/* =====================================================================
   사운드 효과 생성기 (Web Audio API - 외부 파일 없이 순수 JS 합성)
   ===================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.08, vol = 0.12) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // 오디오 미지원 환경 예외 무시
  }
}

function playSuccessChime() {
  if (!soundEnabled) return;
  playTone(523.25, 'triangle', 0.12, 0.1); // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.14, 0.1), 100); // E5
  setTimeout(() => playTone(783.99, 'triangle', 0.22, 0.12), 200); // G5
}

/* =====================================================================
   풍부한 음악 데이터베이스 (Music DB)
   요구조건 반영:
   - 영하: 크리스마스/겨울 음악
   - 영상 15도 이하: 출근 유무와 기분에 따라 신나거나 위로가 되는 노래
   - 영상 15도 이상 25도 이하: 출근 유무와 기분에 따라 신나거나 설레는 노래
   - 영상 25도 이상: 여름에 많이 듣는 노래
   - 외출 유형 반영:
     * 데이트 -> 설레는 R&B 위주
     * 여행 -> 신나는 케이팝 / 신나는 팝 위주
     * 출근 -> 신나는 해외 팝송 / 에너지 팝 위주
     * 집콕 -> 포근한 재즈 / 어쿠스틱 / 멜로우 위주
   ===================================================================== */
const musicCatalog = [
  // -----------------------------------------------------------------
  // 1. FREEZING (영하 < 0°C) : 크리스마스에 많이 듣는 노래 & 겨울 캐롤
  // -----------------------------------------------------------------
  // 데이트 -> 설레는 캐롤 & R&B
  {
    title: "미리 메리 크리스마스 (Feat. 천둥)",
    artist: "아이유 (IU)",
    tempCat: "freezing",
    outing: "date",
    mood: ["flutter", "happy", "tired"],
    origin: "korea",
    genre: "설레는 크리스마스 R&B / 팝",
    emoji: "🎄",
    reason: "영하의 매서운 칼바람도 사르르 녹여버릴 정도로 달콤한 아이유표 고백송이에요. 데이트하는 두 사람의 손을 꼭 맞잡게 해줄 거예요!"
  },
  {
    title: "첫 눈",
    artist: "EXO (엑소)",
    tempCat: "freezing",
    outing: "date",
    mood: ["flutter", "happy", "gloomy"],
    origin: "korea",
    genre: "겨울 감성 팝 / R&B",
    emoji: "❄️",
    reason: "영하의 추위 속에서 내리는 하얀 첫눈을 함께 맞으며 걸을 때 듣기 가장 로맨틱한 겨울 데이트 명곡이에요."
  },
  {
    title: "All I Want for Christmas Is You",
    artist: "Mariah Carey",
    tempCat: "freezing",
    outing: "date",
    mood: ["flutter", "happy", "tired"],
    origin: "foreign",
    genre: "홀리데이 러브 R&B / 팝",
    emoji: "🎁",
    reason: "영하의 겨울 데이트엔 전 세계 공인 크리스마스 여왕의 목소리가 정답이죠! 당신만 있으면 된다는 뜨거운 사랑 고백이에요."
  },
  {
    title: "Santa Tell Me",
    artist: "Ariana Grande",
    tempCat: "freezing",
    outing: "date",
    mood: ["flutter", "happy"],
    origin: "foreign",
    genre: "트렌디 윈터 R&B",
    emoji: "🎅",
    reason: "아리아나 그란데의 꿀 떨어지는 음색이 영하의 추위를 잊게 만들고 달콤한 데이트 분위기를 200% 완성해줍니다."
  },

  // 출근이나 등교 -> 추위를 뚫는 신나는 팝송 & 에너지 캐롤
  {
    title: "Underneath the Tree",
    artist: "Kelly Clarkson",
    tempCat: "freezing",
    outing: "commute",
    mood: ["tired", "happy", "gloomy", "flutter"],
    origin: "foreign",
    genre: "파워풀 크리스마스 해외 팝",
    emoji: "🔔",
    reason: "영하의 얼어붙은 아침 출근길, 켈리 클락슨의 폭발적인 성량과 신나는 브라스 사운드가 잠든 텐션을 번쩍 깨워줄 거예요!"
  },
  {
    title: "Last Christmas",
    artist: "Wham!",
    tempCat: "freezing",
    outing: "commute",
    mood: ["gloomy", "tired", "happy"],
    origin: "foreign",
    genre: "신나는 레트로 신스팝",
    emoji: "🧦",
    reason: "영하의 쌀쌀한 바람을 뚫고 걷는 출근길, 발걸음마다 통통 튀는 리듬감을 불어넣어 주는 불멸의 겨울 팝송입니다."
  },
  {
    title: "Must Have Love",
    artist: "SG워너비 & 브라운아이드걸스",
    tempCat: "freezing",
    outing: "commute",
    mood: ["tired", "gloomy", "happy"],
    origin: "korea",
    genre: "에너지 충전 윈터 팝",
    emoji: "☕",
    reason: "영하의 혹한 속에 나서는 출근길, 온몸에 따뜻한 핫팩을 쥐어주는 듯한 밝고 힘찬 윈터 에너지를 전해줘요."
  },
  {
    title: "엉뚱한 상상 (White Christmas)",
    artist: "슈퍼주니어",
    tempCat: "freezing",
    outing: "commute",
    mood: ["tired", "happy", "flutter"],
    origin: "korea",
    genre: "신나는 윈터 댄스",
    emoji: "⛄",
    reason: "추운 날 출근하기 싫은 마음을 유쾌한 상상과 신나는 비트로 가볍게 날려버릴 수 있는 선곡이에요!"
  },

  // 여행 -> 신나는 겨울 케이팝 & 홀리데이 팝
  {
    title: "하얀 겨울",
    artist: "김범수 & 박정현 (원곡 미스터투)",
    tempCat: "freezing",
    outing: "travel",
    mood: ["happy", "flutter", "tired"],
    origin: "korea",
    genre: "신나는 겨울 여행 케이팝",
    emoji: "⛷️",
    reason: "영하의 날씨에 하얀 눈 덮인 스키장이나 겨울 바다로 떠나는 차 안에서 다 함께 떼창하기 최고의 겨울 명곡이에요!"
  },
  {
    title: "Winter Wonderland",
    artist: "Michael Bublé",
    tempCat: "freezing",
    outing: "travel",
    mood: ["happy", "flutter"],
    origin: "foreign",
    genre: "스윙 재즈 / 윈터 팝",
    emoji: "🚗",
    reason: "눈 내리는 겨울 풍경을 감상하며 드라이브 여행을 즐길 때 영화 속 풍경처럼 낭만을 가득 채워주는 명곡입니다."
  },

  // 집콕 -> 포근한 재즈 & 따뜻한 윈터 발라드
  {
    title: "The Christmas Song (Chestnuts Roasting)",
    artist: "Nat King Cole",
    tempCat: "freezing",
    outing: "home",
    mood: ["tired", "gloomy", "happy", "flutter"],
    origin: "foreign",
    genre: "클래식 윈터 재즈",
    emoji: "🎷",
    reason: "바깥은 살을 에는 영하라도, 따뜻한 방 안에서 재즈 피아노와 냇 킹 콜의 온화한 보컬을 들으면 세상 가장 포근한 집콕이 돼요."
  },
  {
    title: "Snowman",
    artist: "Sia",
    tempCat: "freezing",
    outing: "home",
    mood: ["tired", "gloomy", "flutter"],
    origin: "foreign",
    genre: "포근한 윈터 어쿠스틱",
    emoji: "🕯️",
    reason: "영하의 창밖을 바라보며 따뜻한 핫초코 한 잔과 함께 이불 속에 푹 파묻혀 듣기 가장 완벽한 멜로디예요."
  },
  {
    title: "12월의 기적",
    artist: "EXO",
    tempCat: "freezing",
    outing: "home",
    mood: ["tired", "gloomy"],
    origin: "korea",
    genre: "감성 윈터 발라드",
    emoji: "🛋️",
    reason: "추운 날씨에 집에서 조용히 힐링하며 마음속 깊은 감성을 차분하게 어루만져 주는 겨울 노래입니다."
  },

  // -----------------------------------------------------------------
  // 2. COOL (영상 15도 이하, 0°C ~ 14°C) : 신나거나 위로가 되는 노래
  // -----------------------------------------------------------------
  // 출근이나 등교 -> 신나는 해외 팝송 & 위로 팝
  {
    title: "Flowers",
    artist: "Miley Cyrus",
    tempCat: "cool",
    outing: "commute",
    mood: ["tired", "gloomy", "happy"],
    origin: "foreign",
    genre: "신나는 자존감 충전 해외 팝",
    emoji: "💐",
    reason: "쌀쌀한 기온의 출근길, '나는 나 자신을 더 사랑할 수 있어'라며 파워워킹을 이끌어주는 통쾌하고 신나는 해외 팝송이에요!"
  },
  {
    title: "Can't Stop the Feeling!",
    artist: "Justin Timberlake",
    tempCat: "cool",
    outing: "commute",
    mood: ["tired", "happy", "flutter"],
    origin: "foreign",
    genre: "흥 폭발 디스코 팝",
    emoji: "⚡",
    reason: "쌀쌀해서 온몸이 굳어있는 아침, 도입부부터 뼈마디가 리듬을 타게 만들어 피로를 단숨에 털어내줍니다."
  },
  {
    title: "달리기",
    artist: "옥상달빛 (원곡 S.E.S.)",
    tempCat: "cool",
    outing: "commute",
    mood: ["tired", "gloomy"],
    origin: "korea",
    genre: "따스한 힐링 위로곡",
    emoji: "🏃",
    reason: "15도 이하의 쌀쌀한 아침 공기에 마음까지 쓸쓸할 때, '지치고 힘들 땐 끝이 있다는 걸 기억해'라며 다정하게 안아주는 위로송이에요."
  },
  {
    title: "Super Shy",
    artist: "NewJeans",
    tempCat: "cool",
    outing: "commute",
    mood: ["happy", "flutter", "tired"],
    origin: "korea",
    genre: "통통 튀는 저지클럽 케이팝",
    emoji: "👟",
    reason: "서늘한 바람을 뚫고 걸어가는 발걸음을 통통 튀게 만들어주는 경쾌한 비트의 선곡이에요."
  },

  // 데이트 -> 설레는 R&B 위주
  {
    title: "Leave The Door Open",
    artist: "Bruno Mars, Anderson .Paak (Silk Sonic)",
    tempCat: "cool",
    outing: "date",
    mood: ["flutter", "happy", "tired"],
    origin: "foreign",
    genre: "달콤 로맨틱 소울 R&B",
    emoji: "🍷",
    reason: "데이트에는 역시 설레는 R&B가 최고죠! 쌀쌀한 날씨에 어깨를 기댈 때 흘러나오면 영화 같은 분위기를 만들어주는 세련된 소울 트랙입니다."
  },
  {
    title: "Best Part (Feat. H.E.R.)",
    artist: "Daniel Caesar",
    tempCat: "cool",
    outing: "date",
    mood: ["flutter", "happy", "gloomy"],
    origin: "foreign",
    genre: "어쿠스틱 감성 R&B",
    emoji: "☕",
    reason: "선선하고 쌀쌀한 날, 따뜻한 카페에서 연인의 눈을 바라보며 듣기에 이보다 더 달콤한 R&B는 없어요."
  },
  {
    title: "Love Lee",
    artist: "AKMU (악뮤)",
    tempCat: "cool",
    outing: "date",
    mood: ["flutter", "happy"],
    origin: "korea",
    genre: "사랑스러운 어쿠스틱 팝",
    emoji: "💖",
    reason: "도톰한 외투를 입고 나선 데이트길, 마주 보고 웃기만 해도 설렘이 팡팡 터지는 사랑스러운 선곡입니다."
  },
  {
    title: "사건의 지평선",
    artist: "윤하",
    tempCat: "cool",
    outing: "date",
    mood: ["gloomy", "tired", "flutter"],
    origin: "korea",
    genre: "벅차오르는 감성 팝록",
    emoji: "🌌",
    reason: "쌀쌀한 밤공기 속에서 손을 맞잡고 거리를 걸을 때 가슴 깊은 울림과 벅찬 감동을 안겨줘요."
  },

  // 여행 -> 신나는 케이팝 위주
  {
    title: "파이팅 해야지 (Feat. 이영지)",
    artist: "부석순 (SEVENTEEN)",
    tempCat: "cool",
    outing: "travel",
    mood: ["happy", "tired", "flutter"],
    origin: "korea",
    genre: "텐션 200% 신나는 케이팝",
    emoji: "🔥",
    reason: "쌀쌀한 날씨를 잊게 만드는 케이팝의 폭발적인 흥! 여행지로 이동하는 차 안에서 다 같이 외치며 출발해보세요."
  },
  {
    title: "Don't Look Back in Anger",
    artist: "Oasis",
    tempCat: "cool",
    outing: "travel",
    mood: ["happy", "gloomy", "tired"],
    origin: "foreign",
    genre: "떼창 유발 브릿팝",
    emoji: "🎸",
    reason: "서늘한 계절의 여행길, 창밖의 멋진 풍경을 바라보며 목청껏 따라 부르면 일상의 피로가 싹 풀려요."
  },

  // 집콕 -> 포근한 재즈 위주
  {
    title: "Fly Me to the Moon",
    artist: "Frank Sinatra",
    tempCat: "cool",
    outing: "home",
    mood: ["tired", "gloomy", "happy", "flutter"],
    origin: "foreign",
    genre: "클래식 스탠다드 재즈",
    emoji: "🎷",
    reason: "집콕엔 역시 포근한 재즈죠! 쌀쌀한 날씨에 따뜻한 조명 켜두고 재즈의 깊은 선율에 취해보세요."
  },
  {
    title: "Autumn Leaves",
    artist: "Eva Cassidy",
    tempCat: "cool",
    outing: "home",
    mood: ["gloomy", "tired"],
    origin: "foreign",
    genre: "포근하고 깊은 어쿠스틱 재즈",
    emoji: "🍂",
    reason: "차가운 바람이 부는 날 집에서 조용히 마음을 가라앉히며 감상하기 가장 우아하고 포근한 재즈 명곡입니다."
  },
  {
    title: "Rain",
    artist: "태연 (TAEYEON)",
    tempCat: "cool",
    outing: "home",
    mood: ["tired", "gloomy"],
    origin: "korea",
    genre: "재즈풍 멜로우 R&B",
    emoji: "🌧️",
    reason: "서늘한 날씨에 방 안에서 온수 매트 켜고 가만히 들으면 마음에 깊은 위로가 스며드는 명품 보컬 트랙이에요."
  },

  // -----------------------------------------------------------------
  // 3. MILD (영상 15도 이상 25도 이하, 15°C ~ 24°C) : 신나거나 설레는 노래
  // -----------------------------------------------------------------
  // 데이트 -> 설레는 R&B 위주
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    tempCat: "mild",
    outing: "date",
    mood: ["flutter", "happy", "tired"],
    origin: "foreign",
    genre: "로맨틱 레트로 소울 R&B",
    emoji: "🌹",
    reason: "선선하고 기분 좋은 15~25도 날씨 데이트에 흘러나오면, 마치 클래식 로맨스 영화의 주인공이 된 듯한 설렘을 줍니다."
  },
  {
    title: "10,000 Hours",
    artist: "Dan + Shay, Justin Bieber",
    tempCat: "mild",
    outing: "date",
    mood: ["flutter", "happy"],
    origin: "foreign",
    genre: "스윗 어쿠스틱 R&B 팝",
    emoji: "💍",
    reason: "살랑살랑 부는 봄바람처럼 달콤한 저스틴 비버의 목소리가 데이트의 모든 순간을 꿀처럼 달콤하게 만들어줄 거예요."
  },
  {
    title: "봄 사랑 벚꽃 말고",
    artist: "HIGH4, 아이유 (IU)",
    tempCat: "mild",
    outing: "date",
    mood: ["flutter", "happy"],
    origin: "korea",
    genre: "달콤 어쿠스틱 R&B",
    emoji: "🌸",
    reason: "선선하고 따뜻한 날씨에 연인과 손잡고 발맞추어 걷기에 최적화된 국민 설렘 보장 R&B 팝입니다."
  },
  {
    title: "흔들리는 꽃들 속에서 네 샴푸향이 느껴진거야",
    artist: "장범준",
    tempCat: "mild",
    outing: "date",
    mood: ["flutter", "happy", "tired"],
    origin: "korea",
    genre: "설렘 낭만 어쿠스틱",
    emoji: "🌿",
    reason: "기분 좋은 바람이 불어오는 날, 스쳐 지나가는 순간조차 두근거리게 만드는 대표적인 설렘 유발곡이에요."
  },

  // 출근이나 등교 -> 신나는 해외 팝송 위주
  {
    title: "As It Was",
    artist: "Harry Styles",
    tempCat: "mild",
    outing: "commute",
    mood: ["tired", "happy", "flutter"],
    origin: "foreign",
    genre: "신나는 해외 신스팝",
    emoji: "🎧",
    reason: "상쾌한 기온에 어울리는 통통 튀는 신스 비트! 출근길을 가벼운 댄스 플로어로 바꿔주는 글로벌 히트 팝송이에요."
  },
  {
    title: "Shut Up and Dance",
    artist: "WALK THE MOON",
    tempCat: "mild",
    outing: "commute",
    mood: ["tired", "happy"],
    origin: "foreign",
    genre: "에너지 폭발 댄스 팝록",
    emoji: "🕺",
    reason: "선선한 아침 등교/출근길, 귀에 꽂자마자 미소가 번지고 발걸음이 빨라지는 초긍정 에너지의 해외 팝입니다."
  },
  {
    title: "Drama",
    artist: "aespa",
    tempCat: "mild",
    outing: "commute",
    mood: ["tired", "happy", "gloomy"],
    origin: "korea",
    genre: "자신감 뿜뿜 걸크러시",
    emoji: "👑",
    reason: "선선한 날씨 속에서 당당하게 런웨이를 걷는 주인공이 된 듯한 자신감을 채워주는 파워풀한 곡이에요."
  },

  // 여행 -> 신나는 케이팝 위주
  {
    title: "여행",
    artist: "볼빨간사춘기 (BOL4)",
    tempCat: "mild",
    outing: "travel",
    mood: ["happy", "flutter", "tired"],
    origin: "korea",
    genre: "청량 발랄 여행 케이팝",
    emoji: "🧳",
    reason: "15~25도 날씨의 여행에 이보다 완벽한 노래는 없죠! 차창을 내리고 바람을 맞으며 부르는 최고의 청량 케이팝입니다."
  },
  {
    title: "빨간 융단 (Red Carpet)",
    artist: "LUCY (루시)",
    tempCat: "mild",
    outing: "travel",
    mood: ["happy", "flutter"],
    origin: "korea",
    genre: "벅차오르는 바이올린 밴드 팝",
    emoji: "🎻",
    reason: "탁 트인 야외로 여행 떠날 때 가슴을 뻥 뚫어주는 화려한 밴드 사운드가 설렘을 극대화해줘요."
  },
  {
    title: "2002",
    artist: "Anne-Marie",
    tempCat: "mild",
    outing: "travel",
    mood: ["happy", "flutter"],
    origin: "foreign",
    genre: "상큼 발랄 글로벌 팝",
    emoji: "🎡",
    reason: "선선한 날씨에 나들이 떠나며 친구들과 함께 흥얼거리기 가장 사랑스러운 팝송이에요."
  },

  // 집콕 -> 포근한 재즈 위주
  {
    title: "Sunday Morning",
    artist: "Maroon 5",
    tempCat: "mild",
    outing: "home",
    mood: ["happy", "tired", "flutter"],
    origin: "foreign",
    genre: "포근한 그루브 재즈 팝",
    emoji: "🥞",
    reason: "집콕하면서 창문 열고 솔솔 불어오는 바람을 맞으며 커피 마실 때, 완벽한 휴식을 선사하는 그루비한 재즈 팝입니다."
  },
  {
    title: "Don't Know Why",
    artist: "Norah Jones",
    tempCat: "mild",
    outing: "home",
    mood: ["tired", "gloomy"],
    origin: "foreign",
    genre: "우아하고 포근한 보컬 재즈",
    emoji: "☕",
    reason: "아늑한 방 안 소파에 누워 듣는 노라 존스의 나른한 재즈 선율은 지친 심신을 온전히 치유해 줘요."
  },
  {
    title: "주저하는 연인들을 위해",
    artist: "잔나비",
    tempCat: "mild",
    outing: "home",
    mood: ["gloomy", "tired", "flutter"],
    origin: "korea",
    genre: "빈티지 레트로 감성 팝",
    emoji: "📻",
    reason: "선선한 날씨에 방 안에서 아날로그 감성에 푹 빠져들게 만드는 따뜻하고 낭만적인 명곡이에요."
  },

  // -----------------------------------------------------------------
  // 4. HOT (영상 25도 이상, 25°C ~ 34°C) : 여름에 많이 듣는 노래 & 청량 쿨
  // -----------------------------------------------------------------
  // 출근이나 등교 -> 신나는 해외 팝송 & 서머 부스터
  {
    title: "Uptown Funk (Feat. Bruno Mars)",
    artist: "Mark Ronson",
    tempCat: "hot",
    outing: "commute",
    mood: ["tired", "happy", "gloomy"],
    origin: "foreign",
    genre: "무더위 날릴 신나는 해외 팝",
    emoji: "🔥",
    reason: "25도 이상의 더위로 축 처지는 출근길, 도입부 펑키한 리듬부터 도파민이 터지며 무더위를 단숨에 잊게 해줘요!"
  },
  {
    title: "Good Time",
    artist: "Owl City & Carly Rae Jepsen",
    tempCat: "hot",
    outing: "commute",
    mood: ["happy", "tired", "flutter"],
    origin: "foreign",
    genre: "청량 탄산 서머 팝",
    emoji: "🥤",
    reason: "무더운 아침 출근길에 들이켜는 시원한 탄산음료처럼 온몸에 활기를 채워주는 초강력 서머 팝송이에요."
  },
  {
    title: "Dance the Night Away",
    artist: "TWICE (트와이스)",
    tempCat: "hot",
    outing: "commute",
    mood: ["tired", "happy"],
    origin: "korea",
    genre: "청량 폭발 서머 댄스",
    emoji: "🌊",
    reason: "여름 하면 빠질 수 없는 트와이스! 땀 흘리는 출근길에도 에메랄드빛 해변에 온 듯 청량함을 선물해 줘요."
  },

  // 데이트 -> 설레는 서머 R&B 위주
  {
    title: "Peaches (Feat. Daniel Caesar & Giveon)",
    artist: "Justin Bieber",
    tempCat: "hot",
    outing: "date",
    mood: ["flutter", "happy", "tired"],
    origin: "foreign",
    genre: "그루브 서머 R&B",
    emoji: "🍑",
    reason: "여름 데이트엔 달콤한 복숭아 같은 그루브 R&B가 제격! 시원한 카페에서 둘만의 나른하고 로맨틱한 분위기를 만끽해보세요."
  },
  {
    title: "Golden",
    artist: "Harry Styles",
    tempCat: "hot",
    outing: "date",
    mood: ["happy", "flutter"],
    origin: "foreign",
    genre: "햇살 가득 서머 팝",
    emoji: "☀️",
    reason: "눈부신 햇살 아래서 즐기는 여름 데이트의 반짝거리는 설렘을 음악으로 그대로 옮겨놓은 듯한 명곡입니다."
  },
  {
    title: "빨간 맛 (Red Flavor)",
    artist: "Red Velvet (레드벨벳)",
    tempCat: "hot",
    outing: "date",
    mood: ["happy", "flutter"],
    origin: "korea",
    genre: "상큼 과즙미 뿜뿜 케이팝",
    emoji: "🍓",
    reason: "25도가 넘는 여름 데이트에 시원한 딸기 에이드처럼 톡 쏘는 상큼함과 달콤한 설렘을 가득 안겨줘요!"
  },
  {
    title: "Summer Hate (Feat. 비)",
    artist: "지코 (ZICO)",
    tempCat: "hot",
    outing: "date",
    mood: ["tired", "happy"],
    origin: "korea",
    genre: "위트 넘치는 서머 힙합/R&B",
    emoji: "🕶️",
    reason: "'너무 더워!' 투덜거리면서도 시원한 곳을 찾아다니며 유쾌하게 웃을 수 있는 여름 데이트 찰떡 테마송입니다."
  },

  // 여행 -> 신나는 여름 케이팝 위주
  {
    title: "해변의 여인",
    artist: "쿨 (COOL)",
    tempCat: "hot",
    outing: "travel",
    mood: ["happy", "flutter", "tired"],
    origin: "korea",
    genre: "대한민국 대표 여름 레전드 댄스",
    emoji: "🏄",
    reason: "여름에 바다나 휴가지로 떠날 때 절대 빠질 수 없는 여름의 상징! 전주만 나와도 심장이 바운스하는 신나는 노래예요."
  },
  {
    title: "Rollin' (롤린)",
    artist: "브레이브걸스 (BBGIRLS)",
    tempCat: "hot",
    outing: "travel",
    mood: ["happy", "flutter"],
    origin: "korea",
    genre: "역주행 서머 트로피컬 케이팝",
    emoji: "🏖️",
    reason: "시원한 트로피컬 하우스 비트에 맞춰 차 안에서 어깨춤을 추며 떠나기 가장 완벽한 여름 드라이브 송입니다."
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    tempCat: "hot",
    outing: "travel",
    mood: ["happy", "flutter"],
    origin: "foreign",
    genre: "질주하는 청량 디스코 팝",
    emoji: "🚀",
    reason: "뜨거운 여름 태양 아래 고속도로를 질주할 때 온몸을 들썩이게 만드는 최고의 글로벌 서머 히트곡!"
  },

  // 집콕 -> 포근한 재즈 & 칠한 바이브
  {
    title: "The Girl from Ipanema",
    artist: "Stan Getz, Astrud Gilberto",
    tempCat: "hot",
    outing: "home",
    mood: ["happy", "tired", "flutter"],
    origin: "foreign",
    genre: "여름 감성 보사노바 재즈",
    emoji: "🌴",
    reason: "여름 집콕엔 살랑살랑 불어오는 보사노바 재즈가 정답! 시원한 에어컨 아래에서 휴양지 리조트에 누워있는 기분을 선물해 줘요."
  },
  {
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    tempCat: "hot",
    outing: "home",
    mood: ["happy", "tired", "flutter"],
    origin: "foreign",
    genre: "나른하고 달콤한 서머 팝",
    emoji: "🍉",
    reason: "시원한 수박 한 입 베어 물고 침대에 누워 나른한 여름날의 여유를 만끽하기에 더할 나위 없어요."
  },
  {
    title: "비도 오고 그래서 (Feat. 신용재)",
    artist: "헤이즈 (Heize)",
    tempCat: "hot",
    outing: "home",
    mood: ["gloomy", "tired"],
    origin: "korea",
    genre: "촉촉한 서머 감성 R&B",
    emoji: "🌧️",
    reason: "후텁지근한 여름날, 집에서 조용히 비 내리는 창밖을 바라보며 마음을 차분하게 달래줄 감성 명곡입니다."
  }
];

/* =====================================================================
   상태 및 DOM 관리
   ==================================================================== */
const state = {
  temp: 18,
  outing: null,     // 'commute', 'date', 'travel', 'home'
  mood: null,       // 'happy', 'tired', 'gloomy', 'flutter'
  origin: 'korea',  // 'korea', 'foreign'
  lastSongTitle: null
};

const viewIntro = document.getElementById('view-intro');
const viewInput = document.getElementById('view-input');
const viewResult = document.getElementById('view-result');
const loadingOverlay = document.getElementById('loading-overlay');
const toast = document.getElementById('toast-message');
const toastText = document.getElementById('toast-text');
const toastIcon = document.getElementById('toast-icon');

const btnStart = document.getElementById('btn-start');
const btnSubmit = document.getElementById('btn-submit');
const btnReroll = document.getElementById('btn-reroll');
const btnReset = document.getElementById('btn-reset');
const btnToggleSound = document.getElementById('btn-toggle-sound');

const tempSlider = document.getElementById('temp-slider');
const tempValText = document.getElementById('temp-val-text');
const tempStatusBadge = document.getElementById('temp-status-badge');

const outingCards = document.querySelectorAll('#grid-outing .option-card');
const moodCards = document.querySelectorAll('#grid-mood .option-card');
const originButtons = document.querySelectorAll('#grid-origin .seg-button');

let toastTimer = null;

/* 사운드 토글 버튼 */
if (btnToggleSound) {
  btnToggleSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnToggleSound.textContent = soundEnabled ? '🔔' : '🔕';
    btnToggleSound.style.opacity = soundEnabled ? '1' : '0.5';
    if (soundEnabled) playTone(660, 'sine', 0.08, 0.15);
  });
}

/* 온도 카테고리 판별 */
function getTempCat(t) {
  if (t < 0) return "freezing";
  if (t < 15) return "cool";
  if (t <= 24) return "mild";
  return "hot";
}

/* 온도 디스플레이 갱신 */
function updateTempDisplay(val) {
  state.temp = parseInt(val, 10);
  tempValText.textContent = state.temp;

  let badgeHtml = '';
  if (state.temp < 0) {
    badgeHtml = '<span>❄️</span> <span>손끝 꽁꽁! 크리스마스가 생각나는 영하 추위</span>';
    tempValText.style.color = '#3880FF';
  } else if (state.temp < 15) {
    badgeHtml = '<span>🧣</span> <span>코끝 찡한 쌀쌀한 날씨! 외투 필수</span>';
    tempValText.style.color = '#FF708F';
  } else if (state.temp <= 24) {
    badgeHtml = '<span>🍃</span> <span>선선하고 산책하기 딱 좋은 날씨</span>';
    tempValText.style.color = '#FF5E7E';
  } else {
    badgeHtml = '<span>☀️</span> <span>햇살 쨍쨍! 시원함이 절실한 무더위</span>';
    tempValText.style.color = '#FF3B4E';
  }
  tempStatusBadge.innerHTML = badgeHtml;
}

tempSlider.addEventListener('input', (e) => {
  updateTempDisplay(e.target.value);
  playTone(400 + (parseInt(e.target.value) + 20) * 8, 'sine', 0.03, 0.04);
});

/* 외출 선택 바인딩 */
outingCards.forEach(card => {
  card.addEventListener('click', () => {
    outingCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.outing = card.dataset.val;
    document.getElementById('card-outing').classList.remove('shake-error');
    playTone(550, 'sine', 0.05, 0.1);
  });
});

/* 기분 선택 바인딩 */
moodCards.forEach(card => {
  card.addEventListener('click', () => {
    moodCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.mood = card.dataset.val;
    document.getElementById('card-mood').classList.remove('shake-error');
    playTone(620, 'sine', 0.05, 0.1);
  });
});

/* 국내 / 해외 세그먼트 토글 */
originButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    originButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.origin = btn.dataset.val;
    playTone(500, 'sine', 0.04, 0.08);
  });
});

/* 화면 전환 */
function switchScreen(target) {
  [viewIntro, viewInput, viewResult].forEach(v => v.classList.remove('active'));
  target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnStart.addEventListener('click', () => {
  playTone(600, 'triangle', 0.08, 0.12);
  switchScreen(viewInput);
});

/* 토스트 알림 */
function triggerToast(msg, icon = '⚠️') {
  toastText.textContent = msg;
  toastIcon.textContent = icon;
  toast.classList.add('show');
  playTone(300, 'square', 0.08, 0.08);
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* =====================================================================
   선곡 알고리즘
   ===================================================================== */
function findBestSong() {
  const curCat = getTempCat(state.temp);

  // 1순위: 온도구간 + 외출유형 + 기분(포함) + 국내/해외 일치
  let pool = musicCatalog.filter(s => {
    return s.tempCat === curCat &&
           s.outing === state.outing &&
           s.mood.includes(state.mood) &&
           s.origin === state.origin;
  });

  // 2순위: 온도구간 + 외출유형 + 국내/해외 일치 (기분 완화)
  if (pool.length === 0) {
    pool = musicCatalog.filter(s => {
      return s.tempCat === curCat &&
             s.outing === state.outing &&
             s.origin === state.origin;
    });
  }

  // 3순위: 외출유형 + 국내/해외 일치
  if (pool.length === 0) {
    pool = musicCatalog.filter(s => {
      return s.outing === state.outing && s.origin === state.origin;
    });
  }

  // 4순위: 온도구간 + 국내/해외 일치
  if (pool.length === 0) {
    pool = musicCatalog.filter(s => {
      return s.tempCat === curCat && s.origin === state.origin;
    });
  }

  // 5순위: 전체 중 국내/해외 일치
  if (pool.length === 0) {
    pool = musicCatalog.filter(s => s.origin === state.origin);
  }

  // 연속 같은 곡 방지
  if (pool.length > 1 && state.lastSongTitle) {
    pool = pool.filter(s => s.title !== state.lastSongTitle);
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  state.lastSongTitle = picked.title;
  return picked;
}

/* 친근하고 생동감 넘치는 맞춤 추천 멘트 생성 */
function createRecommendationComment() {
  const t = state.temp;
  const cat = getTempCat(t);
  const o = state.outing;
  const m = state.mood;

  let tempMention = "";
  if (cat === "freezing") {
    tempMention = `오늘 기온 ${t}도로 손발이 꽁꽁 얼 것 같은 영하의 추위잖아 🥶❄️`;
  } else if (cat === "cool") {
    tempMention = `오늘 ${t}도로 공기가 꽤 쌀쌀해서 겉옷 든든하게 챙겨야겠어 🧣🍂`;
  } else if (cat === "mild") {
    tempMention = `오늘 딱 ${t}도로 살랑살랑 기분 좋은 바람 부는 날씨네 🍃🌸`;
  } else {
    tempMention = `오늘 무려 ${t}도라니 가만히 있어도 땀이 삐질 나는 핫한 날씨야 ☀️🔥`;
  }

  let contextMention = "";
  if (o === "commute") {
    if (m === "tired") {
      contextMention = "출근(등교)해야 해서 몸도 무겁고 너무 피곤하지 ㅠㅠ 이 노래 듣고 텐션 팍팍 충전해서 힘차게 나가보자! 🎧💪💕";
    } else if (m === "gloomy") {
      contextMention = "출근길인데 마음도 싱숭생숭 우울하지 🥺 이 노래가 네 마음을 따뜻하게 토닥여줄 테니 힘내서 파이팅이야! ☕🌈";
    } else if (m === "happy") {
      contextMention = "오늘따라 기분도 좋은데 출근길마저 신나는 런웨이로 만들어버리자! 발걸음 가볍게 출근 완료해보자구 💃✨";
    } else {
      contextMention = "설레는 마음 가득 안고 나서는 출근길! 오늘 하루 모든 일이 술술 풀리길 응원할게 🍀🥰";
    }
  } else if (o === "date") {
    if (m === "flutter" || m === "happy") {
      contextMention = "두근두근 설레는 데이트 날이네! 콩닥거리는 심장 박동에 딱 맞춘 달콤한 노래로 골라왔어 💑💖🍓";
    } else if (m === "tired") {
      contextMention = "데이트 나가는데 조금 피곤하지만 얼굴 보면 피로가 사르르 녹을 거야! 이 음악과 함께 힐링 데이트하고 와 🥰🥂";
    } else {
      contextMention = "기분 전환이 필요한 날, 데이트에 로맨틱한 마법을 퐁퐁 뿌려줄게! 예쁜 추억 가득 만들길 바라 🌹✨";
    }
  } else if (o === "travel") {
    if (m === "happy" || m === "flutter") {
      contextMention = "신나게 떠나는 여행이라니 상상만 해도 심장 쿵쾅거려! 볼륨 빵빵하게 틀고 신나게 달려보자 🚗✈️🎉";
    } else if (m === "tired") {
      contextMention = "일상에 지쳐 떠나는 힐링 여행이구나 ㅠㅠ 복잡한 생각은 다 내려놓고 이 노래 들으면서 푹 쉬다 와 🌿🏖️";
    } else {
      contextMention = "우울한 마음 다 털어버리러 떠나는 멋진 여행길! 이 음악이 너의 최고의 여행 메이트가 되어줄 거야 🌅🧳";
    }
  } else { // home (집콕)
    if (m === "tired") {
      contextMention = "피곤할 땐 내 방 이불 속이 최고 명당이지! 포근하게 누워서 귀호강 제대로 누려봐 🛋️☕😴";
    } else if (m === "gloomy") {
      contextMention = "울적할 땐 굳이 나가지 말고 집에서 맛있는 거 먹으며 이 노래 들어봐. 마음이 몽글몽글 따스해질 거야 🍪🕯️";
    } else if (m === "happy") {
      contextMention = "기분 좋은 날 즐기는 여유로운 홈캉스! 나만의 홈카페를 열고 이 음악과 함께 행복 만끽해봐 🍰🎶";
    } else {
      contextMention = "집에서 혼자 보내는 시간마저 로맨틱한 영화 속 한 장면으로 만들어줄 감성 선곡이야 🎬🍿✨";
    }
  }

  return `${tempMention} ${contextMention}`;
}

const outingDict = {
  commute: { name: "출근이나 등교", emoji: "🏢" },
  date: { name: "데이트", emoji: "💑" },
  travel: { name: "여행", emoji: "✈️" },
  home: { name: "집콕", emoji: "🛋️" }
};

const moodDict = {
  happy: { name: "좋음", emoji: "😊" },
  tired: { name: "피곤함", emoji: "🥱" },
  gloomy: { name: "우울함", emoji: "😢" },
  flutter: { name: "설렘", emoji: "🥰" }
};

/* 결과 렌더링 */
function renderRecommendation() {
  const song = findBestSong();
  if (!song) return;

  // 1. 요약 뱃지
  const outingObj = outingDict[state.outing];
  const moodObj = moodDict[state.mood];
  const originObj = state.origin === 'korea' ? { name: "국내 가요", emoji: "🇰🇷" } : { name: "해외 팝송", emoji: "🌐" };

  const summaryHtml = `
    <div class="sum-badge">🌡️ ${state.temp}°C</div>
    <div class="sum-badge">${outingObj.emoji} ${outingObj.name}</div>
    <div class="sum-badge">${moodObj.emoji} ${moodObj.name}</div>
    <div class="sum-badge">${originObj.emoji} ${originObj.name}</div>
  `;
  document.getElementById('result-summary-bar').innerHTML = summaryHtml;

  // 2. 추천 멘트
  const comment = createRecommendationComment();
  document.getElementById('result-comment').textContent = comment;

  // 3. 노래 정보
  document.getElementById('song-title').textContent = song.title;
  document.getElementById('song-artist').textContent = song.artist;
  document.getElementById('song-genre-tag').textContent = song.genre;
  document.getElementById('album-art-emoji').textContent = song.emoji || '🎵';

  // 유튜브 검색 링크
  const query = encodeURIComponent(`${song.artist} ${song.title}`);
  document.getElementById('btn-youtube-link').href = `https://www.youtube.com/results?search_query=${query}`;

  // 4. 추천 이유
  document.getElementById('result-reason').textContent = song.reason;
}

/* 입력 제출 버튼 클릭 */
btnSubmit.addEventListener('click', () => {
  // 1) 외출 미선택 검사
  if (!state.outing) {
    const cardOuting = document.getElementById('card-outing');
    cardOuting.classList.add('shake-error');
    cardOuting.scrollIntoView({ behavior: 'smooth', block: 'center' });
    triggerToast('오늘의 외출 이유를 선택해주세요! 🏃‍♀️', '👉');
    return;
  }

  // 2) 기분 미선택 검사
  if (!state.mood) {
    const cardMood = document.getElementById('card-mood');
    cardMood.classList.add('shake-error');
    cardMood.scrollIntoView({ behavior: 'smooth', block: 'center' });
    triggerToast('지금 나의 기분을 선택해주세요! 🥰', '👉');
    return;
  }

  // 로딩 애니메이션 실행
  loadingOverlay.classList.add('active');
  playTone(440, 'triangle', 0.1, 0.1);

  setTimeout(() => {
    renderRecommendation();
    loadingOverlay.classList.remove('active');
    switchScreen(viewResult);
    playSuccessChime();
  }, 650);
});

/* 같은 조건으로 재추천 */
btnReroll.addEventListener('click', () => {
  loadingOverlay.classList.add('active');
  playTone(500, 'triangle', 0.08, 0.1);
  setTimeout(() => {
    renderRecommendation();
    loadingOverlay.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSuccessChime();
  }, 450);
});

/* 다시 골라보기 버튼 클릭 (초기화 후 입력 화면으로) */
btnReset.addEventListener('click', () => {
  playTone(480, 'sine', 0.08, 0.1);
  state.outing = null;
  state.mood = null;
  state.lastSongTitle = null;

  outingCards.forEach(c => c.classList.remove('selected'));
  moodCards.forEach(c => c.classList.remove('selected'));
  document.getElementById('card-outing').classList.remove('shake-error');
  document.getElementById('card-mood').classList.remove('shake-error');

  switchScreen(viewInput);
});

// 초기 온도 표시 세팅
updateTempDisplay(18);
