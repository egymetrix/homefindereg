/* eslint-disable @typescript-eslint/no-explicit-any */
import TransitionBox from "@/components/shared/TransitionBox";
import ContactUs from "../../properties/components/contact-us";
import "../[id]/service.css";

const ServiceContainer = ({ service }: { service: any }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-screen-xl">
        <div className="flex flex-col lg:flex-row gap-3">
          <TransitionBox
            containerClassName="lg:w-[70%]"
            transitionType="fromLeft"
            delay={0.2}
          >
            <div className="p-4 md:p-6">
              <div
                className="text-gray-800 prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-700 prose-ul:text-gray-600 prose-li:text-gray-600 prose-ul:list-disc prose-ol:list-decimal"
                dangerouslySetInnerHTML={{ __html: service.long_content }}
              />
            </div>
          </TransitionBox>

          <TransitionBox
            containerClassName="lg:w-[30%]"
            transitionType="fromRight"
            delay={0.4}
          >
            <div className="p-6 md:p-8">
              <ContactUs type="service" />
            </div>
          </TransitionBox>
        </div>
      </div>
    </section>
  );
};

export default ServiceContainer;
