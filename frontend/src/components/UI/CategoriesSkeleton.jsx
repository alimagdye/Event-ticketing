import { Skeleton } from "../shadcn/skeleton";

function CategoriesSkeleton({ key }) {
  return (
    <div
      key={key}
      className=" w-full aspect-square h-full flex flex-col justify-end items-center gap-4 border border-gray-50 rounded-full p-5"
    >
      <Skeleton className="aspect-square w-fit h-full bg-gray-300 rounded-full" />
      <Skeleton className="h-4 w-2/3 bg-gray-300 " />
    </div>
  );
}

export default CategoriesSkeleton;
