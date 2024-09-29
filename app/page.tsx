"use client";

import ReviewSendMoney from "@/components/send/ReviewSendMoney";
import SendMoney from "@/components/send/SendMoney";
import { useState } from "react";

enum FLOW {
  SEND_MONEY = 'send_money',
  REVIEW = 'review'
}
export default function Home() {
  const [sendFlow, setSendFlow] = useState(FLOW.SEND_MONEY)

  const handleClick = () => setSendFlow(FLOW.REVIEW)

  const sendMoneyFlow = {
    [FLOW.SEND_MONEY]: <SendMoney handleClick={handleClick} />,
    [FLOW.REVIEW]: <ReviewSendMoney handleClick={() => setSendFlow(FLOW.SEND_MONEY)} />
  }

  return (
    <section className="flex justify-center">
      {sendMoneyFlow[sendFlow]}
    </section>
  );
}
