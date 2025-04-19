import Header from "@/components/shared/Header";

const ProfilePage = () => {
  return (
    <div>
      <Header withBg withShadow />
      <div className="max-w-screen-xl min-h-screen mx-auto py-3">
        <div className="px-4 sm:px-6 lg:px-8 text-center my-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
