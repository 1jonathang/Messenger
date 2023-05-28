// what nextjs falls back to when the page.tsx component is loading
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface LoadingProps {}

const loading: FC<LoadingProps> = ({}) => {
  // npm i react-loading-skeleton
  return (
    <div className="w-full flex flex-col gap-3">
      <Skeleton className="mb-4" height={60} width={500} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
      <Skeleton height={50} width={350} />
    </div>
  );
};

export default loading;
