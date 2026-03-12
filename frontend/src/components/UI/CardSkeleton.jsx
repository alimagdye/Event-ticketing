import { Skeleton } from "../shadcn/skeleton";

function CardSkeleton({key}) {
    return (  <div
                  key={key}
                  className="flex flex-col-reverse justify-end items-center gap-3 border border-gray-50 rounded-xl p-4"
                >
                  <Skeleton className="h-4 w-3/4 bg-gray-300 " />
                  <Skeleton className="h-4 w-3/4 bg-gray-300 " />
                  <Skeleton className="h-6 w-2/3 bg-gray-300 m-auto" />

                  <Skeleton className="aspect-video w-full bg-gray-300" />
                </div>);
}

export default CardSkeleton;