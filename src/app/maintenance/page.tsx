"use client";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">🚧 서버 점검 중입니다 🚧</h1>
      <p className="text-lg mb-8">
        현재 서버 점검 중입니다. 점검이 완료된 후 서비스가 재개됩니다.
      </p>
      <p className="text-gray-400">
        문의 사항이 있으시면{" "}
        <a href="mailto:support@example.com" className="text-yellow-400">
          support@boost-x.com
        </a>
        으로 연락 주세요.
      </p>
    </div>
  );
}
