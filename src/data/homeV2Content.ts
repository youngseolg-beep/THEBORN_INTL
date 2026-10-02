export type HomeV2Locale = "en" | "ko";

export type HomeV2AssetPath = `/assets/home-v2-assets/${string}`;

export type HomeV2BrandKey = "BORNGA" | "SAEMAEUL" | "PAIKS_NOODLE";

export type HomeV2CountryKey =
  | "United States"
  | "Canada"
  | "Japan"
  | "China"
  | "Taiwan"
  | "Mongolia"
  | "Thailand"
  | "Cambodia"
  | "Malaysia"
  | "Singapore"
  | "Indonesia"
  | "Philippines"
  | "Germany"
  | "Netherlands"
  | "Australia";

export type HomeV2Image = {
  src: HomeV2AssetPath;
  alt: string;
};

export type HomeV2BrandMedia = {
  logo: HomeV2Image;
  primary: HomeV2Image;
  secondary: readonly HomeV2Image[];
  videoEmbedUrl: string;
};

export type HomeV2Brand = {
  key: HomeV2BrandKey;
  englishName: string;
  displayName: string;
  tagline?: string;
  concept: string;
  experienceHeading?: string;
  experience: string;
  tradeArea: string;
  target: string;
  operations: string;
  signatureMenu: readonly string[];
  recommendedStoreSize: readonly string[];
  media: HomeV2BrandMedia;
};

export type HomeV2BrandLabels = {
  signatureMenu: string;
  concept: string;
  target: string;
  operation: string;
  scale: string;
};

export type HomeV2Hero = {
  eyebrow: string;
  title: string;
  description: string;
};

export type HomeV2Corporate = {
  name: "THEBORN";
  media: {
    heroImage: HomeV2Image;
    partnershipImage: HomeV2Image;
    primaryLogo: HomeV2Image;
  };
};

export type HomeV2GlobalEntity = {
  market: "USA" | "China" | "Japan";
  entityName: string;
};

export type HomeV2SummaryLine = {
  before: string;
  number?: 15 | 160;
  after: string;
};

export type HomeV2GlobalPresence = {
  title: "GLOBAL";
  overview: string;
  overseasSummary: {
    accessibleText: string;
    lines: readonly HomeV2SummaryLine[];
  };
  countryNames: Record<HomeV2CountryKey, string>;
  mapAriaLabel: string;
  restaurantBrands: { moreThan: number };
  totalStores: {
    approximate: number;
    scope: "domestic and international";
  };
  overseasOperations: {
    countries: number;
    approximateStores: number;
  };
  localEntities: readonly HomeV2GlobalEntity[];
  operatesThroughLocalEntities: true;
  otherMarketsModel: "Master Franchise";
  masterFranchiseSince: number;
  partnerSelection: string;
  media: {
    kind: "custom-svg-world-map";
    status: "pending";
    src: null;
  };
};

export type HomeV2Partnership = {
  title: string;
  model: string;
  description: string;
  managementPolicy: string;
  partnerSelection: string;
  relationship: {
    brand: string;
    partner: string;
  };
  media: HomeV2Image;
};

export type HomeV2ClosingStory = {
  eyebrow: "WHY THE BORN";
  title: string;
  titleLines: readonly [string, string];
  paragraphs: readonly string[];
  closingMessage: "THANK YOU FOR YOUR INTEREST.";
};

export type HomeV2QualificationRequirement = {
  text: string;
  emphasis: string;
  lineGroups: readonly string[];
};

export type HomeV2Qualifications = {
  title: "Qualifications";
  requiredDocumentsTitle: string;
  requirements: readonly HomeV2QualificationRequirement[];
  requiredDocuments: readonly string[];
};

export type HomeV2ProcessStep = {
  step: number;
  title: string;
  lineGroups: readonly string[];
};

export type HomeV2Process = {
  title: "Process";
  stepScreenReaderLabel: string;
  steps: readonly HomeV2ProcessStep[];
  downloads: {
    title: string;
    applicationForm: string;
    action: string;
    ariaLabel: string;
  };
};

export type HomeV2ContactKey = "masterFranchise" | "usa" | "china" | "japan";

export type HomeV2ContactEntry = {
  key: HomeV2ContactKey;
  category: string;
  email: string;
};

export type HomeV2ContactInformation = {
  title: "Contact";
  emailActionLabel: string;
  internationalInquiryGuidance: string;
  entries: readonly HomeV2ContactEntry[];
};

export type HomeV2GalleryCopy = {
  title: "Gallery";
  openImage: string;
  image: string;
  of: string;
  close: string;
  previous: string;
  next: string;
};

export type HomeV2Content = {
  hero: HomeV2Hero;
  corporate: HomeV2Corporate;
  globalPresence: HomeV2GlobalPresence;
  brands: Record<HomeV2BrandKey, HomeV2Brand>;
  brandLabels: HomeV2BrandLabels;
  gallery: HomeV2GalleryCopy;
  partnership: HomeV2Partnership;
  qualifications: HomeV2Qualifications;
  process: HomeV2Process;
  contact: HomeV2ContactInformation;
  whyTheBorn: HomeV2ClosingStory;
};

const sharedContent = {
  corporate: {
    name: "THEBORN",
    media: {
      heroImage: {
        src: "/assets/home-v2-assets/corporate/ceo-cooking-final.jpg",
        alt: "THEBORN chef cooking in a professional kitchen",
      },
      partnershipImage: {
        src: "/assets/home-v2-assets/corporate/ceo-team.png",
        alt: "THEBORN culinary team in a professional kitchen",
      },
      primaryLogo: {
        src: "/assets/home-v2-assets/corporate/theborn-logo-alt.png",
        alt: "THEBORN logo",
      },
    },
  },
  partnershipMedia: {
    src: "/assets/home-v2-assets/corporate/ceo-team.png",
    alt: "THEBORN culinary team",
  },
  globalPresence: {
    title: "GLOBAL",
    overview:
      "THEBORN operates more than 20 restaurant brands and approximately 3,200 directly operated and franchised stores domestically and internationally.",
    restaurantBrands: { moreThan: 20 },
    totalStores: {
      approximate: 3200,
      scope: "domestic and international",
    },
    overseasOperations: {
      countries: 15,
      approximateStores: 160,
    },
    localEntities: [
      { market: "USA", entityName: "TheBorn America" },
      { market: "China", entityName: "TheBorn China" },
      { market: "Japan", entityName: "TheBorn Japan" },
    ],
    operatesThroughLocalEntities: true,
    otherMarketsModel: "Master Franchise",
    masterFranchiseSince: 2023,
    media: {
      kind: "custom-svg-world-map",
      status: "pending",
      src: null,
    },
  },
  brands: {
    BORNGA: {
      key: "BORNGA",
      englishName: "BORNGA",
      tagline: "Original Korean Taste",
      tradeArea:
        "Major-city prime commercial areas, high-income customer areas, and tourist districts",
      media: {
        logo: { src: "/assets/home-v2-assets/bornga/logo.png", alt: "BORNGA logo" },
        primary: {
          src: "/assets/home-v2-assets/bornga/image-05.png",
          alt: "BORNGA staff serving guests at a Korean BBQ table",
        },
        secondary: [
          { src: "/assets/home-v2-assets/bornga/image-09.png", alt: "BORNGA restaurant exterior" },
          { src: "/assets/home-v2-assets/bornga/image-11.jpg", alt: "BORNGA Korean BBQ meal and side dishes" },
          { src: "/assets/home-v2-assets/bornga/image-18.png", alt: "Grilled meat wrapped in lettuce at BORNGA" },
        ],
        videoEmbedUrl: "https://www.youtube.com/embed/L4JR9SuM8hQ",
      },
    },
    SAEMAEUL: {
      key: "SAEMAEUL",
      englishName: "SAEMAEUL",
      tagline: "The Original Korean BBQ",
      tradeArea:
        "High-traffic commercial districts, station areas, office/residential mixed districts",
      media: {
        logo: { src: "/assets/home-v2-assets/saemaeul/logo.png", alt: "SAEMAEUL logo" },
        primary: {
          src: "/assets/home-v2-assets/saemaeul/image-10.jpg",
          alt: "Busy SAEMAEUL restaurant interior",
        },
        secondary: [
          { src: "/assets/home-v2-assets/saemaeul/image-04.png", alt: "Meat being cut over a grill at SAEMAEUL" },
          { src: "/assets/home-v2-assets/saemaeul/image-01.webp", alt: "SAEMAEUL direct-fire BBQ lettuce wrap" },
          { src: "/assets/home-v2-assets/saemaeul/image-05.png", alt: "SAEMAEUL restaurant storefront" },
        ],
        videoEmbedUrl: "https://www.youtube.com/embed/80X0DF6MTKA",
      },
    },
    PAIKS_NOODLE: {
      key: "PAIKS_NOODLE",
      englishName: "PAIK'S NOODLE",
      tradeArea:
        "Major-city commercial areas, station areas, and mixed residential/business districts",
      media: {
        logo: { src: "/assets/home-v2-assets/paiks-noodle/logo.png", alt: "PAIK'S NOODLE 홍콩반점0410 logo" },
        primary: {
          src: "/assets/home-v2-assets/paiks-noodle/image-14.png",
          alt: "PAIK'S NOODLE restaurant entrance and dining area",
        },
        secondary: [
          { src: "/assets/home-v2-assets/paiks-noodle/image-02.png", alt: "PAIK'S NOODLE cook working over a steaming wok" },
          { src: "/assets/home-v2-assets/paiks-noodle/image-07.png", alt: "Sauce being poured into a wok at PAIK'S NOODLE" },
          { src: "/assets/home-v2-assets/paiks-noodle/image-13.png", alt: "PAIK'S NOODLE noodles lifted with chopsticks" },
        ],
        videoEmbedUrl: "https://www.youtube.com/embed/2OHtdE98h8I",
      },
    },
  },
  contactEntries: [
    { key: "masterFranchise", email: "international@theborn.co.kr" },
    { key: "usa", email: "kevin.kim@theborn.co.kr" },
    { key: "china", email: "ihsuh@theborn.cn" },
    { key: "japan", email: "theborn.japan@theborn.co.kr" },
  ],
} as const;

const localizedContent = {
  en: {
    hero: {
      eyebrow: "Korea's Leading Restaurant Franchise Group",
      title: "THE BORN",
      description: "Bringing the energy of Korean dining brands to global markets, built on over 30 years of restaurant operation know-how.",
    },
    globalPresence: {
      overseasSummary: {
        accessibleText: "Overseas operations currently span 15 countries with approximately 160 stores.",
        lines: [
          { before: "Overseas operations currently span", after: "" },
          { before: "", number: 15, after: " countries with" },
          { before: "approximately ", number: 160, after: " stores." },
        ],
      },
      countryNames: {
        "United States": "UNITED STATES", Canada: "CANADA", Japan: "JAPAN", China: "CHINA", Taiwan: "TAIWAN",
        Mongolia: "MONGOLIA", Thailand: "THAILAND", Cambodia: "CAMBODIA", Malaysia: "MALAYSIA",
        Singapore: "SINGAPORE", Indonesia: "INDONESIA", Philippines: "PHILIPPINES", Germany: "GERMANY",
        Netherlands: "NETHERLANDS", Australia: "AUSTRALIA",
      },
      mapAriaLabel: "World map showing THEBORN expansion from South Korea to its overseas destinations.",
      partnerSelection: "Master Franchise partners are selected through an internal qualification review.",
    },
    brandLabels: { signatureMenu: "SIGNATURE MENU", concept: "CONCEPT", target: "TARGET", operation: "OPERATION", scale: "SCALE" },
    brands: {
      BORNGA: {
        displayName: "BORNGA",
        concept: "Premium authentic Korean BBQ dining",
        experience: "Sizzling grills. Shared tables. Warm conversations over premium Korean BBQ. BORNGA delivers a Korean dining experience built around gathering, grilling, and sharing together.",
        target: "Families, business gatherings, and international guests seeking Korean dining experiences",
        operations: "Premium dining model suitable for group dining and family occasions",
        signatureMenu: ["Woo Samgyeop", "Kkotsal", "Doenjang Jjigae", "Dolsot Bibimbap"],
        recommendedStoreSize: ["APPROX. 331–661 M²", "150+ SEATS"],
      },
      SAEMAEUL: {
        displayName: "SAEMAEUL",
        concept: "Casual Korean dining based on direct-fire BBQ",
        experience: "Late-night energy. Smoky grills. Shared drinks and vibrant tables. SAEMAEUL captures the lively atmosphere of Korean social dining culture.",
        target: "Office workers, customers in their 20s–40s, couples, and value-oriented Korean dining customers",
        operations: "Flexible lunch/dinner model supporting dine-in, takeaway, and delivery",
        signatureMenu: ["Yeoltan Bulgogi", "7-Minute Pork Kimchi", "Samgyeopsal", "Old-Fashioned Lunchbox", "Baekbap"],
        recommendedStoreSize: ["198+ M²", "APPROX. 100 SEATS"],
      },
      PAIKS_NOODLE: {
        displayName: "PAIK'S NOODLE",
        concept: "Casual Korean-Chinese restaurant with accessible pricing",
        experience: "Hot flames. Bold wok flavors. Fast and comforting meals made for everyday dining. PAIK'S NOODLE brings the fast-paced energy of Korean-Chinese cuisine to the table.",
        target: "Families, students, office workers, and customers seeking convenient casual meals",
        operations: "Compact store model optimized for delivery and takeaway",
        signatureMenu: ["Jjajangmyeon", "Jjamppong", "Tangsuyuk"],
        recommendedStoreSize: ["APPROX. 50–83 M²", "UNDER 20 SEATS", "COMPACT DINE-IN + DELIVERY/TAKEAWAY MODEL"],
      },
    },
    gallery: { title: "Gallery", openImage: "Open", image: "image", of: "of", close: "Close gallery", previous: "Previous image", next: "Next image" },
    partnership: {
      title: "Master Franchise Partnership", model: "Master Franchise",
      description: "THE BORN brings proven brands and operating systems. Our partners bring market expertise and execution. Together, we build sustainable growth.",
      managementPolicy: "Since 2023, markets outside USA, China, and Japan have been managed primarily through the Master Franchise system.",
      partnerSelection: "Master Franchise partners are selected through an internal qualification review.",
      relationship: { brand: "THE BORN", partner: "PARTNER" },
    },
    qualifications: {
      title: "Qualifications", requiredDocumentsTitle: "Required Documents",
      requirements: [
        { text: "Local company with at least 3 years of F&B or related business experience", emphasis: "at least 3 years", lineGroups: ["Local company with at least 3 years", "of F&B or related", "business experience"] },
        { text: "Sufficient capital for direct-store expansion", emphasis: "direct-store expansion", lineGroups: ["Sufficient capital for direct-store", "expansion"] },
        { text: "Franchise business experience preferred", emphasis: "Franchise business experience", lineGroups: ["Franchise business experience", "preferred"] },
      ],
      requiredDocuments: ["Business registration", "Audited financial statements for the last 3 years", "Company profile"],
    },
    process: {
      title: "Process", stepScreenReaderLabel: "Step",
      steps: [
        { step: 1, title: "Business application submission", lineGroups: ["Business application", "submission"] },
        { step: 2, title: "Submission of qualification documents", lineGroups: ["Submission of qualification", "documents"] },
        { step: 3, title: "Online business meeting", lineGroups: ["Online business", "meeting"] },
        { step: 4, title: "Business feasibility and qualification review", lineGroups: ["Business feasibility", "and qualification review"] },
        { step: 5, title: "Decision on franchise business progression", lineGroups: ["Decision on franchise", "business progression"] },
        { step: 6, title: "NDA execution", lineGroups: ["NDA execution"] },
        { step: 7, title: "Business information sharing and business plan development", lineGroups: ["Business information", "sharing and business plan", "development"] },
        { step: 8, title: "Franchise agreement execution", lineGroups: ["Franchise agreement", "execution"] },
        { step: 9, title: "Business launch including market research, training, and opening", lineGroups: ["Business launch including", "market research, training,", "and opening"] },
      ],
      downloads: { title: "Downloads", applicationForm: "APPLICATION FORM", action: "DOWNLOAD", ariaLabel: "Download Application Form (DOCX)" },
    },
    contact: {
      title: "Contact", emailActionLabel: "Email",
      internationalInquiryGuidance: "For franchise inquiries outside of USA, China, and Japan, please contact international@theborn.co.kr.",
      categories: { masterFranchise: "Master Franchise", usa: "USA", china: "China", japan: "Japan" },
    },
    whyTheBorn: {
      eyebrow: "WHY THE BORN", title: "A Brand People Remember", titleLines: ["A BRAND PEOPLE", "REMEMBER"],
      paragraphs: [
        "THE BORN brands are more than restaurants.",
        "We create spaces where people gather, share stories, and enjoy warm meals together.",
        "Even within the fast-paced energy of Korean dining culture, we believe warmth and hospitality should always remain.",
        "That is the direction THE BORN pursues as a global restaurant brand.",
      ],
      closingMessage: "THANK YOU FOR YOUR INTEREST.",
    },
  },
  ko: {
    hero: {
      eyebrow: "대한민국 대표 외식 프랜차이즈 그룹", title: "더본코리아",
      description: "30년 이상의 외식 운영 노하우를 바탕으로 한국 외식 브랜드의 에너지를 세계 시장에\n전합니다.",
    },
    globalPresence: {
      overseasSummary: {
        accessibleText: "해외 15개의 국가에서 약 160개의 매장이 운영되고 있습니다.",
        lines: [
          { before: "해외 ", number: 15, after: "개의 국가에서" },
          { before: "약 ", number: 160, after: "개의 매장이" },
          { before: "운영되고 있습니다.", after: "" },
        ],
      },
      countryNames: {
        "United States": "미국", Canada: "캐나다", Japan: "일본", China: "중국", Taiwan: "대만",
        Mongolia: "몽골", Thailand: "태국", Cambodia: "캄보디아", Malaysia: "말레이시아",
        Singapore: "싱가포르", Indonesia: "인도네시아", Philippines: "필리핀", Germany: "독일",
        Netherlands: "네덜란드", Australia: "호주",
      },
      mapAriaLabel: "대한민국에서 해외 시장으로 확장하는 더본의 여정을 보여주는 세계 지도.",
      partnerSelection: "마스터 프랜차이즈 파트너는 당사의 내부 적격성 심사를 거쳐\n선정됩니다.",
    },
    brandLabels: { signatureMenu: "대표 메뉴", concept: "콘셉트", target: "타깃 고객", operation: "운영 특징", scale: "매장 규모" },
    brands: {
      BORNGA: {
        displayName: "본가", concept: "정통 한식 프리미엄 BBQ 다이닝", experienceHeading: "프리미엄 Korean BBQ 다이닝",
        experience: "뜨겁게 구워지는 고기, 함께 둘러앉은 테이블, 프리미엄 Korean BBQ가 만드는 따뜻한 식사 경험. 본가는 함께 굽고, 나누고, 즐기는 한국식 BBQ 문화를 담아냅니다.",
        target: "가족, 비즈니스 모임, 한국 BBQ 문화를 경험하고자 하는 고객",
        operations: "고품질 원육과 신선한 식재료를 바탕으로 단체 모임까지 수용 가능한 프리미엄 운영 모델",
        signatureMenu: ["우삼겹", "꽃살", "된장찌개", "돌솥비빔밥"], recommendedStoreSize: ["100~200평 내외 / 150석 이상"],
      },
      SAEMAEUL: {
        displayName: "새마을식당", concept: "숯불 직화 BBQ 기반 한국식 캐주얼 다이닝", experienceHeading: "한국식 캐주얼 BBQ & 소셜 다이닝",
        experience: "늦은 밤까지 이어지는 활기, 숯불 위의 불맛, 술잔과 웃음이 오가는 한국식 외식 문화. 새마을식당은 한국 특유의 활기 있는 소셜 다이닝 분위기를 담아냅니다.",
        target: "직장인, 20~40대 고객층, 캐주얼 한식과 주류를 즐기는 고객",
        operations: "점심 식사부터 저녁 BBQ와 주류까지 대응 가능한 유연한 운영 모델",
        signatureMenu: ["열탄불고기", "7분돼지김치", "삼겹살", "옛날도시락"], recommendedStoreSize: ["60평 이상 / 100석 내외"],
      },
      PAIKS_NOODLE: {
        displayName: "홍콩반점", concept: "합리적인 가격의 캐주얼 중식 전문 브랜드", experienceHeading: "한국식 중화요리 브랜드",
        experience: "강한 불맛, 빠르게 완성되는 한 그릇, 일상 속에서 즐기는 한국식 중화요리. 홍콩반점은 웍의 화력과 빠른 주방의 에너지를 그대로 담아냅니다.",
        target: "가족, 학생, 직장인 등 빠르고 부담 없는 식사를 원하는 고객",
        operations: "소형 매장, 배달, 테이크아웃에 적합한 효율적인 운영 구조",
        signatureMenu: ["짜장면", "짬뽕", "탕수육", "볶음밥"], recommendedStoreSize: ["15~25평 내외 / 20석 미만"],
      },
    },
    gallery: { title: "Gallery", openImage: "열기", image: "이미지", of: "중", close: "갤러리 닫기", previous: "이전 이미지", next: "다음 이미지" },
    partnership: {
      title: "마스터 프랜차이즈 파트너십", model: "마스터 프랜차이즈",
      description: "더본의 검증된 브랜드와 운영 시스템,\n파트너의 현지 시장 전문성과 실행력이 만나\n함께 지속 가능한 성장을 만들어갑니다.",
      managementPolicy: "2023년부터 미국, 중국, 일본을 제외한 해외 시장은\n마스터 프랜차이즈 형태로 운영하고 있습니다.",
      partnerSelection: "마스터 프랜차이즈 파트너는 당사의 내부 적격성 심사를 거쳐\n선정됩니다.",
      relationship: { brand: "더본", partner: "파트너" },
    },
    qualifications: {
      title: "Qualifications", requiredDocumentsTitle: "필요서류",
      requirements: [
        { text: "최소 3년 이상의 F&B 혹은 유사업종 사업 경력의 현지 기업", emphasis: "최소 3년 이상", lineGroups: ["최소 3년 이상의 F&B 혹은", "유사업종 사업 경력의 현지 기업"] },
        { text: "사업 확장을 위한 충분한 자본력(직영점 확장을 위함)", emphasis: "직영점 확장", lineGroups: ["사업 확장을 위한 충분한 자본력", "(직영점 확장을 위함)"] },
        { text: "프랜차이즈 사업 경험자 우대", emphasis: "프랜차이즈 사업 경험", lineGroups: ["프랜차이즈 사업 경험자 우대"] },
      ],
      requiredDocuments: ["사업자등록증 / 법인등록 서류", "최근 3개년 재무제표", "회사 소개서"],
    },
    process: {
      title: "Process", stepScreenReaderLabel: "단계",
      steps: [
        { step: 1, title: "사업신청서 접수", lineGroups: ["사업신청서 접수"] },
        { step: 2, title: "적격성 서류 제출", lineGroups: ["적격성 서류 제출"] },
        { step: 3, title: "비대면 미팅", lineGroups: ["비대면 미팅"] },
        { step: 4, title: "사업성 검토", lineGroups: ["사업성 검토"] },
        { step: 5, title: "진행 여부 확정", lineGroups: ["진행 여부 확정"] },
        { step: 6, title: "NDA 체결", lineGroups: ["NDA 체결"] },
        { step: 7, title: "사업계획 수립", lineGroups: ["사업계획 수립"] },
        { step: 8, title: "가맹계약 체결", lineGroups: ["가맹계약 체결"] },
        { step: 9, title: "사업개시", lineGroups: ["사업개시"] },
      ],
      downloads: { title: "다운로드", applicationForm: "사업신청서", action: "다운로드", ariaLabel: "사업신청서 다운로드 (DOCX)" },
    },
    contact: {
      title: "Contact", emailActionLabel: "이메일",
      internationalInquiryGuidance: "미국, 중국, 일본 외 모든 가맹 문의는 international@theborn.co.kr로 문의 주시기 바랍니다.",
      categories: { masterFranchise: "마스터 프랜차이즈 문의", usa: "미국", china: "중국", japan: "일본" },
    },
    whyTheBorn: {
      eyebrow: "WHY THE BORN", title: "사람이 기억에 남는 브랜드", titleLines: ["사람이 기억에 남는", "브랜드"],
      paragraphs: [
        "더본의 브랜드는 단순히 음식을 판매하는 공간이 아닙니다.",
        "사람들이 함께 웃고, 이야기하고, 따뜻한 한 끼를 나누는 공간을 만듭니다.",
        "빠르고 활기찬 한국 외식 문화 속에서도 사람의 온기를 잃지 않는 브랜드.",
        "그것이 더본이 추구하는 글로벌 외식 브랜드의 방향입니다.",
      ],
      closingMessage: "THANK YOU FOR YOUR INTEREST.",
    },
  },
} as const;

function createContent(locale: HomeV2Locale): HomeV2Content {
  const localized = localizedContent[locale];
  const brands = Object.fromEntries(
    (Object.keys(sharedContent.brands) as HomeV2BrandKey[]).map((key) => [
      key,
      { ...sharedContent.brands[key], ...localized.brands[key] },
    ]),
  ) as unknown as Record<HomeV2BrandKey, HomeV2Brand>;
  const entries = sharedContent.contactEntries.map((entry) => ({
    ...entry,
    category: localized.contact.categories[entry.key],
  }));

  return {
    hero: localized.hero,
    corporate: sharedContent.corporate,
    globalPresence: { ...sharedContent.globalPresence, ...localized.globalPresence },
    brands,
    brandLabels: localized.brandLabels,
    gallery: localized.gallery,
    partnership: { ...localized.partnership, media: sharedContent.partnershipMedia },
    qualifications: localized.qualifications,
    process: localized.process,
    contact: {
      title: localized.contact.title,
      emailActionLabel: localized.contact.emailActionLabel,
      internationalInquiryGuidance: localized.contact.internationalInquiryGuidance,
      entries,
    },
    whyTheBorn: localized.whyTheBorn,
  };
}

export const homeV2ContentByLocale: Readonly<Record<HomeV2Locale, HomeV2Content>> = {
  en: createContent("en"),
  ko: createContent("ko"),
};

export const homeV2Content = homeV2ContentByLocale.en;
