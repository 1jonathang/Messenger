import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

export default async function Home() {

  // await db.set('hello', 'hello')

  return (
    <div className='text-red-500'>
      <Button variant={"ghost"}>Hello</Button>
    </div>
  )
}
