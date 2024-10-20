import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const json = Object.fromEntries(formData);
  console.log(json);
  return redirect("/");
}

export default function Index() {
  return (
    <div className="h-screen p-12">
      <h1 className="text-4xl font-bold">Work Journal</h1>
      <p className="text-sm text-gray-400">Learning and doing</p>

      <div className="my-8 border rounded-md space-y-4 p-8 border-gray-600">
        <Form method="post">
          <p className="text-sm text-gray-400"> Create a new entry </p>
          <div className="flex items-center gap-4 my-4">
            <input className="bg-gray-900 p-2 rounded-md" type="date" name="date" id="date" />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="work">
              <input id="work" className="mr-2" type="radio" name="title" placeholder="Title" />
              Work
            </label>
            <label htmlFor="learning">
              <input id="learning" className="mr-2" type="radio" name="title" placeholder="Title" />
              Learning
            </label>
            <label htmlFor="other">
              <input id="other" className="mr-2" type="radio" name="title" placeholder="Title" />
              Other
            </label>
          </div>
          <div className="mt-4">
            <textarea
              name="content"
              className="w-full h-24 bg-gray-900 p-2 rounded-md"
              rows={10}
              placeholder="Write your entry here..."
            />
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" type="submit">
            Submit
          </button>
        </Form>
      </div>


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
