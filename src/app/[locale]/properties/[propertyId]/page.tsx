import Header from "@/components/shared/Header";
import PropertyContainer from "@/app/[locale]/properties/components/property-container";

const PropertyPage = async ({ params }: { params: { propertyId: string } }) => {
  const { propertyId } = await params;
  return (
    <>
      <Header withBg withShadow />
      <div className="bg-gray-50">
        <PropertyContainer propertyId={propertyId} />
      </div>
    </>
  );
};

export default PropertyPage;
