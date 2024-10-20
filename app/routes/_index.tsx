import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="h-screen p-12">
      <h1 className="text-4xl font-bold">Work Journal</h1>
      <p className="text-sm text-gray-400">Learning and doing</p>

      <div className="mt-4 space-y-4">
        <div className="">
          <p>Work</p>
          <ul className="list-disc list-inside ml-4">
            <li>first item</li>
            <li>second item</li>
          </ul>
        </div>
        <div className="">
          <p>Learning</p>
          <ul className="list-disc list-inside ml-4">
            <li>first item</li>
            <li>second item</li>
          </ul>
        </div>
        <div className="">
          <p>Other</p>
          <ul className="list-disc list-inside ml-4">
            <li>first item</li>
            <li>second item</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
