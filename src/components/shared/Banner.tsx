const Banner = ({
  backgroundImage,
  height = "90vh",
  children,
}: {
  backgroundImage: string;
  height?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className="relative w-full -mt-[72px] shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
      style={{ height }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 ">{children}</div>
      </div>
    </div>
  );
};

export default Banner;
