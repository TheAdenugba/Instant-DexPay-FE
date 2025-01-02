"use client";
import SendMoney from "@/components/send/SendMoney";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/review')
  }
  return (
    <section className="flex justify-center">
      <SendMoney handleClick={handleClick} />
    </section>
  );
}
