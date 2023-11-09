import { Tab } from "@headlessui/react";

export default function CollectionSkeleton() {
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };
  return (
    <div className="h-80 flex rounded-3xl mb-10 opacity-50">
      <div className="w-80 h-full flex justify-center items-center rounded-xl bg-slate-800">
        <svg
          className="w-20 h-20 fill-slate-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 18"
        >
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>
      <div className="w-[calc(100%-320px)] h-full rounded-3xl ml-4">
        <Tab.Group>
          <Tab.List className="h-16 flex rounded-xl bg-slate-800">
            <Tab className="w-full rounded-lg border-slate-900"></Tab>
            <Tab className="w-full rounded-lg"></Tab>
          </Tab.List>
          <Tab.Panels className="w-full h-[calc(100%-80px)] rounded-xl bg-slate-800 mt-4">
            <Tab.Panel className=""></Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
