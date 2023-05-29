import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArraySchema } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";


export async function generateMetadata({
  params,
}: {
  params: { chatId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const [userId1, userId2] = params.chatId.split('--')
  const { user } = session

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User

  return { title: `Messenger | ${chatPartner.name}'s chat` }
}

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    // bc in a chat the most recent messsages are shown first, want to reverse the array of messages so the most previous entry is first
    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArraySchema.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params;

  // a user should be logged in to view any chat, which is already being enforced by our middleware
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string;

  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      {/* friends info, pfp name and email as a banner divdivdivdivdivdiv*/}
      <div className="pl-6 flex sm:items-center justify-between py-3 border-b bordero-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              {/*  Users google profile */}
              <Image
                fill
                // for google images
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name}'s profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatPartner={chatPartner}
        chatId={chatId}
        sessionImg={session.user.image}
        initialMessages={initialMessages}
        sessionId={session.user.id}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;

