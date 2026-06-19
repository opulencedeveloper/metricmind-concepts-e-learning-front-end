'use client';

import { memo } from 'react';
import { CurriculumItemType } from '@/enums/curriculum';
import { CurriculumCardProps } from '@/types/curriculum-cards';
import LectureCard from './LectureCard';
import QuizCard from './QuizCard';
import ArticleCard from './ArticleCard';

const CurriculumCard = memo((props: CurriculumCardProps & { isActive?: boolean }) => {
  switch (props.type) {
    case CurriculumItemType.Lecture:
      return <LectureCard {...(props as any)} />;

    case CurriculumItemType.Quiz:
      return <QuizCard {...(props as any)} />;

    case CurriculumItemType.Article:
      return <ArticleCard {...(props as any)} />;

    case CurriculumItemType.Resource:
    case CurriculumItemType.Assignment:
      // Use LectureCard as fallback for now
      return <LectureCard {...(props as any)} />;

    default:
      return null;
  }
});

CurriculumCard.displayName = 'CurriculumCard';
export default CurriculumCard;
