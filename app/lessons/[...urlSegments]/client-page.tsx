'use client';

import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { LessonQuery, LessonQueryVariables } from '@/tina/__generated__/types';
import { Section } from '@/components/layout/section';
import { components } from '@/components/mdx-components';
import Link from 'next/link';

interface ClientPageProps {
    data: LessonQuery;
    variables: LessonQueryVariables;
    query: string;
}

export default function LessonClientPage(props: ClientPageProps) {
    const { data } = useTina(props);
    const lesson = data.lesson;

    return (
        <Section>
            <article className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4" data-tina-field={tinaField(lesson, 'name')}>
                        {lesson.name}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                        {lesson.durationMinutes && (
                            <span
                                className="px-3 py-1 bg-gray-100 rounded-full"
                                data-tina-field={tinaField(lesson, 'durationMinutes')}
                            >
                                {lesson.durationMinutes} minutes
                            </span>
                        )}
                        {lesson.module && (
                            <Link
                                href={`/modules/${lesson.module._sys?.breadcrumbs.join('/')}`}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                                data-tina-field={tinaField(lesson, 'module')}
                            >
                                Module: {lesson.module.name}
                            </Link>
                        )}
                        {lesson.hasLab && lesson.lab && (
                            <Link
                                href={`/labs/${lesson.lab._sys?.breadcrumbs.join('/')}`}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                                data-tina-field={tinaField(lesson, 'lab')}
                            >
                                Lab Available
                            </Link>
                        )}
                    </div>
                </div>

                {lesson.body && (
                    <div className="prose prose-lg max-w-none" data-tina-field={tinaField(lesson, 'body')}>
                        <TinaMarkdown content={lesson.body} components={components} />
                    </div>
                )}
            </article>
        </Section>
    );
}
