// app/routes/profile.$userId.addTodaySong.tsx
import { PrismaClient } from '@prisma/client';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { action as postAction } from 'app/features/profile/action';
import AddTodaySongPage from 'app/features/profile/pages/addTodaySong';

const prisma = new PrismaClient();

export const meta: MetaFunction = () => [{ title: '오늘의 추천곡 수정' }];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = Number(params.userId);
  if (isNaN(userId)) {
    throw new Response('잘못된 사용자입니다.', { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      todayRecommendedSong: {
        select: {
          id: true,
          title: true,
          artist: true,
          album: true,
          thumbnailUrl: true,
        },
      },
    },
  });

  return json({
    initialSong: user?.todayRecommendedSong ?? null,
  });
};

export const action = postAction;

export default function AddTodaySongRoute() {
  const { initialSong } = useLoaderData<typeof loader>();
  return <AddTodaySongPage initialSong={initialSong} />;
}
