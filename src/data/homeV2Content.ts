export type HomeV2AssetPath = `/assets/home-v2-assets/${string}`;

export type HomeV2BrandKey = "BORNGA" | "SAEMAEUL" | "PAIKS_NOODLE";

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
  koreanName?: string;
  tagline?: string;
  concept: string;
  experience: string;
  tradeArea: string;
  target: string;
  operations: string;
  signatureMenu: readonly string[];
  recommendedStoreSize: readonly string[];
  media: HomeV2BrandMedia;
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

export type HomeV2GlobalPresence = {
  title: "GLOBAL";
  overview: string;
  overseasSummary: string;
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
  title: "Master Franchise Partnership";
  model: "Master Franchise";
  description: string;
  managementPolicy: string;
  partnerSelection: string;
  relationship: {
    brand: "THE BORN";
    partner: "PARTNER";
  };
  media: HomeV2Image;
};

export type HomeV2ClosingStory = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  closingMessage: string;
  media: HomeV2Image;
};

export type HomeV2Qualifications = {
  title: "Qualifications";
  requirements: readonly string[];
  requiredDocuments: readonly string[];
};

export type HomeV2ProcessStep = {
  step: number;
  title: string;
};

export type HomeV2Process = {
  title: "Process";
  steps: readonly HomeV2ProcessStep[];
};

export type HomeV2ContactCategory = "Master Franchise" | "USA" | "China" | "Japan";

export type HomeV2ContactEntry = {
  category: HomeV2ContactCategory;
  email: string;
};

export type HomeV2ContactInformation = {
  title: "Contact";
  internationalInquiryGuidance: string;
  entries: readonly HomeV2ContactEntry[];
};

export type HomeV2Content = {
  hero: HomeV2Hero;
  corporate: HomeV2Corporate;
  globalPresence: HomeV2GlobalPresence;
  brands: Record<HomeV2BrandKey, HomeV2Brand>;
  partnership: HomeV2Partnership;
  qualifications: HomeV2Qualifications;
  process: HomeV2Process;
  contact: HomeV2ContactInformation;
  whyTheBorn: HomeV2ClosingStory;
};

export const homeV2Content = {
  hero: {
    eyebrow: "Korea's Leading Restaurant Franchise Group",
    title: "THE BORN",
    description:
      "Bringing the energy of Korean dining brands to global markets, built on over 30 years of restaurant operation know-how.",
  },
  corporate: {
    name: "THEBORN",
    media: {
      heroImage: {
        src: "/assets/home-v2-assets/corporate/ceo-cooking.jpg",
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
  globalPresence: {
    title: "GLOBAL",
    overview:
      "THEBORN operates more than 20 restaurant brands and approximately 3,200 directly operated and franchised stores domestically and internationally.",
    overseasSummary:
      "Overseas operations currently span 15 countries with approximately 160 stores.",
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
    partnerSelection:
      "Master Franchise partners are selected through an internal qualification review.",
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
      concept: "Premium authentic Korean BBQ dining",
      experience:
        "Sizzling grills. Shared tables. Warm conversations over premium Korean BBQ. BORNGA delivers a Korean dining experience built around gathering, grilling, and sharing together.",
      tradeArea:
        "Major-city prime commercial areas, high-income customer areas, and tourist districts",
      target:
        "Families, business gatherings, and international guests seeking Korean dining experiences",
      operations:
        "Premium dining model suitable for group dining and family occasions",
      signatureMenu: [
        "Woo Samgyeop",
        "Kkotsal",
        "Doenjang Jjigae",
        "Dolsot Bibimbap",
      ],
      recommendedStoreSize: ["APPROX. 331–661 M²", "150+ SEATS"],
      media: {
        logo: {
          src: "/assets/home-v2-assets/bornga/logo.png",
          alt: "BORNGA logo",
        },
        primary: {
          src: "/assets/home-v2-assets/bornga/image-05.png",
          alt: "BORNGA staff serving guests at a Korean BBQ table",
        },
        secondary: [
          {
            src: "/assets/home-v2-assets/bornga/image-09.png",
            alt: "BORNGA restaurant exterior",
          },
          {
            src: "/assets/home-v2-assets/bornga/image-11.jpg",
            alt: "BORNGA Korean BBQ meal and side dishes",
          },
          {
            src: "/assets/home-v2-assets/bornga/image-18.png",
            alt: "Grilled meat wrapped in lettuce at BORNGA",
          },
        ],
        videoEmbedUrl: "https://www.youtube.com/embed/L4JR9SuM8hQ",
      },
    },
    SAEMAEUL: {
      key: "SAEMAEUL",
      englishName: "SAEMAEUL",
      tagline: "The Original Korean BBQ",
      concept: "Casual Korean dining based on direct-fire BBQ",
      experience:
        "Late-night energy. Smoky grills. Shared drinks and vibrant tables. SAEMAEUL captures the lively atmosphere of Korean social dining culture.",
      tradeArea:
        "High-traffic commercial districts, station areas, office/residential mixed districts",
      target:
        "Office workers, customers in their 20s–40s, couples, and value-oriented Korean dining customers",
      operations:
        "Flexible lunch/dinner model supporting dine-in, takeaway, and delivery",
      signatureMenu: [
        "Yeoltan Bulgogi",
        "7-Minute Pork Kimchi",
        "Samgyeopsal / Moksal / Pork Skin",
        "Old-Fashioned Lunchbox",
        "Baekbap",
      ],
      recommendedStoreSize: ["198+ M²", "APPROX. 100 SEATS"],
      media: {
        logo: {
          src: "/assets/home-v2-assets/saemaeul/logo.png",
          alt: "SAEMAEUL logo",
        },
        primary: {
          src: "/assets/home-v2-assets/saemaeul/image-10.jpg",
          alt: "Busy SAEMAEUL restaurant interior",
        },
        secondary: [
          {
            src: "/assets/home-v2-assets/saemaeul/image-04.png",
            alt: "Meat being cut over a grill at SAEMAEUL",
          },
          {
            src: "/assets/home-v2-assets/saemaeul/image-01.webp",
            alt: "SAEMAEUL direct-fire BBQ lettuce wrap",
          },
          {
            src: "/assets/home-v2-assets/saemaeul/image-05.png",
            alt: "SAEMAEUL restaurant storefront",
          },
        ],
        videoEmbedUrl: "https://www.youtube.com/embed/80X0DF6MTKA",
      },
    },
    PAIKS_NOODLE: {
      key: "PAIKS_NOODLE",
      englishName: "PAIK'S NOODLE",
      koreanName: "홍콩반점0410",
      concept: "Casual Korean-Chinese restaurant with accessible pricing",
      experience:
        "Hot flames. Bold wok flavors. Fast and comforting meals made for everyday dining. PAIK'S NOODLE brings the fast-paced energy of Korean-Chinese cuisine to the table.",
      tradeArea:
        "Major-city commercial areas, station areas, and mixed residential/business districts",
      target:
        "Families, students, office workers, and customers seeking convenient casual meals",
      operations: "Compact store model optimized for delivery and takeaway",
      signatureMenu: ["Jjajangmyeon", "Jjamppong", "Tangsuyuk"],
      recommendedStoreSize: [
        "APPROX. 50–83 M²",
        "UNDER 20 SEATS",
        "COMPACT DINE-IN + DELIVERY/TAKEAWAY MODEL",
      ],
      media: {
        logo: {
          src: "/assets/home-v2-assets/paiks-noodle/logo.png",
          alt: "PAIK'S NOODLE 홍콩반점0410 logo",
        },
        primary: {
          src: "/assets/home-v2-assets/paiks-noodle/image-14.png",
          alt: "PAIK'S NOODLE restaurant entrance and dining area",
        },
        secondary: [
          {
            src: "/assets/home-v2-assets/paiks-noodle/image-02.png",
            alt: "PAIK'S NOODLE cook working over a steaming wok",
          },
          {
            src: "/assets/home-v2-assets/paiks-noodle/image-07.png",
            alt: "Sauce being poured into a wok at PAIK'S NOODLE",
          },
          {
            src: "/assets/home-v2-assets/paiks-noodle/image-13.png",
            alt: "PAIK'S NOODLE noodles lifted with chopsticks",
          },
        ],
        videoEmbedUrl: "https://www.youtube.com/embed/2OHtdE98h8I",
      },
    },
  },
  partnership: {
    title: "Master Franchise Partnership",
    model: "Master Franchise",
    description:
      "THE BORN brings proven brands and operating systems. Our partners bring market expertise and execution. Together, we build sustainable growth.",
    managementPolicy:
      "Since 2023, markets outside USA, China, and Japan have been managed primarily through the Master Franchise system.",
    partnerSelection:
      "Master Franchise partners are selected through an internal qualification review.",
    relationship: {
      brand: "THE BORN",
      partner: "PARTNER",
    },
    media: {
      src: "/assets/home-v2-assets/corporate/ceo-team.png",
      alt: "THEBORN culinary team",
    },
  },
  qualifications: {
    title: "Qualifications",
    requirements: [
      "Local company with at least 3 years of F&B or related business experience",
      "Sufficient capital for direct-store expansion",
      "Franchise business experience preferred",
    ],
    requiredDocuments: [
      "Business registration",
      "Audited financial statements for the last 3 years",
      "Company profile",
    ],
  },
  process: {
    title: "Process",
    steps: [
      { step: 1, title: "Business application submission" },
      { step: 2, title: "Submission of qualification documents" },
      { step: 3, title: "Online business meeting" },
      { step: 4, title: "Business feasibility and qualification review" },
      { step: 5, title: "Decision on franchise business progression" },
      { step: 6, title: "NDA execution" },
      {
        step: 7,
        title: "Business information sharing and business plan development",
      },
      { step: 8, title: "Franchise agreement execution" },
      {
        step: 9,
        title: "Business launch including market research, training, and opening",
      },
    ],
  },
  contact: {
    title: "Contact",
    internationalInquiryGuidance:
      "For franchise inquiries outside of USA, China, and Japan, please contact international@theborn.co.kr.",
    entries: [
      {
        category: "Master Franchise",
        email: "international@theborn.co.kr",
      },
      { category: "USA", email: "kevin.kim@theborn.co.kr" },
      { category: "China", email: "ihsuh@theborn.cn" },
      { category: "Japan", email: "theborn.japan@theborn.co.kr" },
    ],
  },
  whyTheBorn: {
    eyebrow: "WHY THE BORN",
    title: "A Brand People Remember",
    paragraphs: [
      "THE BORN brands are more than restaurants.",
      "We create spaces where people gather, share stories, and enjoy warm meals together.",
      "Even within the fast-paced energy of Korean dining culture, we believe warmth and hospitality should always remain.",
      "That is the direction THE BORN pursues as a global restaurant brand.",
    ],
    closingMessage: "THANK YOU FOR YOUR INTEREST.",
    media: {
      src: "/assets/home-v2-assets/bornga/image-05.png",
      alt: "BORNGA staff member serving guests at a Korean BBQ table",
    },
  },
} as const satisfies HomeV2Content;
