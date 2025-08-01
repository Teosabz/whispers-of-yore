import Header from "../components/Header";

const mockUser = {
  username: "folkloreFan",
  email: "folklore@tales.com",
  joined: "2025-04-12",
  favorites: 2,
};

export default function Profile() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-6">
          My Profile
        </h1>

        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-6 space-y-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-200">
          <p>
            <strong className="font-semibold text-neutral-900 dark:text-white">
              Username:
            </strong>{" "}
            {mockUser.username}
          </p>
          <p>
            <strong className="font-semibold text-neutral-900 dark:text-white">
              Email:
            </strong>{" "}
            {mockUser.email}
          </p>
          <p>
            <strong className="font-semibold text-neutral-900 dark:text-white">
              Joined:
            </strong>{" "}
            {mockUser.joined}
          </p>
          <p>
            <strong className="font-semibold text-neutral-900 dark:text-white">
              Favorite Stories:
            </strong>{" "}
            {mockUser.favorites}
          </p>
        </div>
      </main>
    </>
  );
}
