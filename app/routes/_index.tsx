import { PrismaClient } from '@prisma/client';
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export const db = new PrismaClient()

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { date, title, content } = Object.fromEntries(formData);

  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!date || !title || !content) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  await db.entry.create({
    data: {
      date: new Date(date as string),
      type: title as string,
      text: content as string,
    },
  });
  return json({ success: true });
}

export default function Index() {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && textAreaRef.current) {
      textAreaRef.current.value = ""
      textAreaRef.current?.focus();
    }
  }, [fetcher.state]);
  

  return (
    <div className="h-screen p-12">
      <h1 className="text-4xl font-bold">Work Journal</h1>
      <p className="text-sm text-gray-400">Learning and doing</p>

      <div className="my-8 border rounded-md space-y-4 p-8 border-gray-600">
        <p className="text-sm text-gray-400">Create a new entry</p>

        <fetcher.Form method="post">
          <fieldset className="disabled:opacity-50" disabled={fetcher.state === "submitting"}>
            <div className="flex items-center gap-4 my-4">
              <input className="bg-gray-900 p-2 rounded-md" type="date" name="date" id="date" required defaultValue={format(new Date(), "yyyy-MM-dd")} />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="work">  
                <input id="work" className="mr-2" type="radio" name="title" placeholder="Title" defaultChecked required />
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
                required
                ref={textAreaRef}
              />
            </div>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" type="submit">
              { fetcher.state === "submitting" ? "Submitting..." : "Submit" }
            </button>
          </fieldset>
        </fetcher.Form>
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
