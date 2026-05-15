export default function Requirements({ lang }: { lang: "ko" | "en" }) {
  const requirements =
    lang === "ko"
      ? [
          "최소 3년 이상의 F&B 혹은 유사업종 사업 경력의 현지 기업",
          "사업 확장을 위한 충분한 자본력(직영점 확장을 위함)",
          "프랜차이즈 사업 경험자 우대",
        ]
      : [
          "Local company with at least 3 years of F&B or similar business experience",
          "Sufficient capital for business expansion (for direct store expansion)",
          "Preference for those with franchise business experience",
        ];

  return (
    <section id="requirements" className="py-24 bg-[#0F0F10] text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {lang === "ko" ? "MF 출점 자격조건" : "Franchise Requirements"}
        </h2>

        <div className="bg-[#18181B] p-8 rounded-2xl border border-white/10 shadow-sm">
          <p className="mb-6 text-lg text-zinc-300">
            {lang === "ko"
              ? "더본코리아는 함께 성장할 마스터 프랜차이즈(MF) 파트너를 모집합니다. 아래 조건들은 파트너 선정의 기본 요건으로 내부 적격성 평가를 거쳐 다음 단계 여부를 결정합니다."
              : "THE BORN is recruiting Master Franchise (MF) partners to grow together. The conditions below are the basic requirements for partner selection, and the next steps will be decided after an internal eligibility evaluation."}
          </p>

          <ul className="list-disc list-inside space-y-3 text-lg text-zinc-100">
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
