import Header from "@/components/shared/Header";
import PropertyContainer from "@/app/[locale]/properties/components/property-container";
import { getProperty } from "@/services/properties";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string; propertyId: string };
}) => {
  const { propertyId } = await params;
  const id = propertyId.split("-")[1];
  const property = await getProperty(id);
  console.log(property?.data);

  return {
    title: property?.data.home_name,
    description: property?.data.home_description,
  };
};

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
