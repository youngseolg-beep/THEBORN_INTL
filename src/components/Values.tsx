import { motion } from "motion/react";
import { Shield, Zap, Heart, Globe } from "lucide-react";

export default function Values() {
  const values = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "혁신 (Innovation)",
      description: "우리는 기존의 틀을 깨고 새로운 가능성을 끊임없이 탐구합니다."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "신뢰 (Trust)",
      description: "투명한 소통과 정직한 행동으로 고객과의 단단한 신뢰를 쌓습니다."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "진심 (Sincerity)",
      description: "모든 제품과 서비스에 우리의 진심과 열정을 담아 전달합니다."
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "상생 (Coexistence)",
      description: "사회와 환경을 생각하며 함께 성장하는 미래를 꿈꿉니다."
    }
  ];

  return (
    <section id="values" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">우리의 핵심 가치</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            우리가 일하는 방식과 추구하는 목표의 중심에는 항상 이 네 가지 가치가 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 bg-background border rounded-2xl hover:shadow-lg transition-shadow text-center"
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-xl mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
