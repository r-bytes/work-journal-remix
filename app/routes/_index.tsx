import { PrismaClient } from '@prisma/client';
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";
import { useEffect, useRef } from "react";

export const db = new PrismaClient()

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const entries = await db.entry.findMany();
  return json({ entries: entries.map(entry => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10)
    }))
  });
}

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
  const { entries } = useLoaderData<typeof loader>();

  const entriesByWeek = entries.reduce<Record<string, typeof entries>>((memo, entry) => {
    const sunday = startOfWeek(parseISO(entry.date));
    const sundayString = format(sunday, "yyyy-MM-dd");

    memo[sundayString] = memo[sundayString] || [];
    memo[sundayString].push(entry);
    return memo;
  }, {} as Record<string, typeof entries>);

  const weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map(dateString => ({
      dateString,
      work: entriesByWeek[dateString].filter(entry => entry.type === "work"),
      learning: entriesByWeek[dateString].filter(entry => entry.type === "learning"),
      other: entriesByWeek[dateString].filter(entry => entry.type === "other"),
    }));

  console.log(weeks);

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
                <input id="work" className="mr-2" type="radio" name="title" placeholder="Title" defaultChecked required value="work" />
                Work
              </label>
              <label htmlFor="learning">
                <input id="learning" className="mr-2" type="radio" name="title" placeholder="Title" value="learning" />
                Learning
              </label>
              <label htmlFor="other">
                <input id="other" className="mr-2" type="radio" name="title" placeholder="Title" value="other" />
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

      {entries.map((entry) => (
        <div key={entry.id} className="border rounded-md p-4 border-gray-600 my-2">
          <p className="text-sm text-gray-400">{format(entry.date, "MMM d, yyyy")}</p>
          <div className="flex items-center gap-2 mb-2 float-right">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
              {entry.type}
            </span>
          </div>
          <p>{entry.id} {entry.text}</p>
        </div>
      ))}
      <div className="mt-12 space-y-12">
        {weeks.map((week) => (
          <div key={week.dateString}>
            <p className="font-bold">
              Week of {format(parseISO(week.dateString), "MMMM do")}
            </p>
            <div className="mt-3 space-y-4">
              {week.work.length > 0 && (
                <div>
                  <p>Work</p>
                  <ul className="ml-8 list-disc">
                    {week.work.map((entry) => (
                      <li key={entry.id}>{entry.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {week.learning.length > 0 && (
                <div>
                  <p>Learning</p>
                  <ul className="ml-8 list-disc">
                    {week.learning.map((entry) => (
                      <li key={entry.id}>{entry.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {week.other.length > 0 && (
                <div>
                  <p>Interesting things</p>
                  <ul className="ml-8 list-disc">
                    {week.other.map((entry) => (
                      <li key={entry.id}>{entry.text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

        {/* <div className="mt-4 space-y-4">
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
      </div> */}
    </div>
  );
}
