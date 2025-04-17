import { useTranslations } from "next-intl";
import Image from "next/image";

export default function OurTeam() {
  const t = useTranslations("About");

  const team = [
    {
      name: t("team.members.member1.name"),
      role: t("team.members.member1.role"),
      image: "https://placehold.co/400x533/e2e8f0/475569?text=AH",
    },
    {
      name: t("team.members.member2.name"),
      role: t("team.members.member2.role"),
      image: "https://placehold.co/400x533/e2e8f0/475569?text=SM",
    },
    {
      name: t("team.members.member3.name"),
      role: t("team.members.member3.role"),
      image: "https://placehold.co/400x533/e2e8f0/475569?text=OA",
    },
    {
      name: t("team.members.member4.name"),
      role: t("team.members.member4.role"),
      image: "https://placehold.co/400x533/e2e8f0/475569?text=NI",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("team.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            {t("team.description")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={533}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
