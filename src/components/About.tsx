import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              우리는 더 나은 세상을 위한 <br />
              <span className="text-primary">새로운 기준</span>을 제시합니다.
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              2020년 작은 아이디어에서 시작된 BrandStory는 이제 업계의 혁신을 주도하는 리더로 성장했습니다. 
              우리는 기술과 디자인의 조화를 통해 사용자에게 최상의 가치를 전달하는 것을 목표로 합니다.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              우리의 모든 결정은 고객의 목소리에서 시작됩니다. 
              끊임없는 도전과 실험을 통해 우리는 어제보다 더 나은 오늘을 만들어가고 있습니다.
            </p>
            
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">파트너사</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">1M+</div>
                <div className="text-sm text-muted-foreground">사용자</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">고객 지원</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://picsum.photos/seed/company/800/800"
                alt="Company Culture"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-xl hidden md:block">
              <p className="text-sm font-italic text-primary italic">
                "혁신은 멈추지 않는 도전에서 시작됩니다."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
