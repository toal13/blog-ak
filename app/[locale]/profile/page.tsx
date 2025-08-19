export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Profile image */}
      <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
        Profile 写真
      </div>

      {/* Profile text */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Your Name</h1>
        <p className="text-base leading-relaxed text-gray-700"></p>
      </div>
    </div>
  );
}
